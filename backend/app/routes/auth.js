const express = require('express');
const { getNonceMessage, generateNonce, verifySignature, generateJWTToken } = require('../helpers');
const router = express.Router();
const sequelize = require("../database");
const { user: User } = sequelize.models;
const { body, param } = require("express-validator");
const { isValidAddress, uniqueAddress, isRegistered, uniqueUsername, isValidUsername } = require('../validators');
const { toChecksumAddress } = require('../sanitizers');
const { validate } = require('../middlewares');

router.get(
    "/get-nonce-message/:address",
    param('address')
        .custom(isValidAddress)
        .customSanitizer(toChecksumAddress),
    validate,
    async (req, res) => {
        const { address } = req.params;
        let user = await User.findOne({
            where: {
                address
            }
        });
        if (!user) {
            user = new User({ address, nonce: generateNonce() });
            user.save();
        }
        res.json({ message: getNonceMessage(user.nonce) });
    }
);

router.post(
    "/register",
    body("name")
        .isString()
        .isLength({ min: 2 }),
    body("image").isURL(),
    body("username")
        .custom(uniqueUsername)
        .withMessage("Username not unique")
        .custom(isValidUsername)
        .withMessage("Username must be atleast 4 characters"),
    body("address")
        .custom(uniqueAddress)
        .custom(isValidAddress)
        .customSanitizer(toChecksumAddress),
    body("signature").isString(),
    validate,
    async (req, res) => {
        const { address, username, name, signature, image } = req.body;
        const user = await User.findOne({
            where: {
                address
            }
        });
        if (user.isRegistered) {
            res.status(401).send({ message: "User already registered" });
            return;
        }
        const isSignValid = verifySignature(getNonceMessage(user.nonce), signature, user.address);
        if (!isSignValid) {
            res.status(401).json({ message: "Invalid Signature" });
            return;
        }
        user.username = username;
        user.name = name;
        user.image = image;
        user.nonce = generateNonce();
        user.isRegistered = true;
        user.save();
        res.json({ token: generateJWTToken(address) });
    }
);

router.post(
    "/login",
    body("address")
        .custom(isValidAddress)
        .custom(isRegistered)
        .customSanitizer(toChecksumAddress),
    body("signature")
        .isString(),
    validate,
    async (req, res) => {
        const { address, signature } = req.body;
        const user = await User.findOne({
            where: {
                address
            }
        });
        const isSignValid = verifySignature(getNonceMessage(user.nonce), signature, address);
        if (!isSignValid) {
            res.status(401).json({ message: "Invalid Signature" });
            return;
        }
        user.nonce = generateNonce();
        user.save();
        res.json({ token: generateJWTToken(address) });
    }
);

router.get(
    "/is-username-available/:username",
    param("username")
        .custom(isValidUsername),
    validate,
    async (req, res) => {
        const { username } = req.params;
        const user = await User.findOne({
            where: {
                username
            }
        });
        res.json({ available: !user });
    }
)

module.exports = router;