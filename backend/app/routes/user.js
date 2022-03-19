const express = require("express");
const { param } = require("express-validator");
const { validate } = require("../middlewares");
const { toChecksumAddress } = require("../sanitizers");
const { isValidAddress, isValidUsername } = require("../validators");
const sequelize = require("../database");
const { onlyAuthorized } = require("../protection_middlewares");
const updateObj = require("../updateObj");
const { user: User } = sequelize.models;

const router = express.Router();

router.get(
    "/address/:address",
    param("address")
        .custom(isValidAddress)
        .customSanitizer(toChecksumAddress),
    validate,
    async (req, res) => {
        const { address } = req.params;
        const user = await User.findOne({
            where: {
                address,
                isRegistered: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
)

router.get(
    "/username/:username",
    param("username")
        .isString(),
    validate,
    async (req, res) => {
        const { username } = req.params;
        const user = await User.findOne({
            where: {
                username,
                isRegistered: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
)

router.put(
    "/update",
    onlyAuthorized,
    async (req, res) => {
        const { user } = req;
        const { username, name, image } = req.body;
        const errors = [];
        updateObj(user, { username, name, image }, {
            username: {
                type: "string",
                validate: isValidUsername,
                async check(username) {
                    const user = await User.findOne({
                        where: {
                            username
                        }
                    });
                    if (user)
                        return "username already registered";
                    return null;
                }
            },
            name: {
                type: "string",
                validate(name) {
                    return name.length < 2;
                },
                check: (name) => null
            },
            image: {
                type: "string",
                validate: (image) => false,
                check: (image) => null
            }
        })
        if (username && user.username != username) {
            if (typeof username != "string" || !isValidUsername(username)) {
                errors.push({
                    field: "username",
                    message: "username format is wrong"
                });
            } else
                user.username = username;
        }
        if (name && user.name !== name) {
            if (typeof name != "string" || name.length < 2) {
                errors.push({
                    field: "name",
                    message: "name format is wrong"
                });
            } else
                user.name = name;
        }
        if (image && user.image !== image) {
            if (typeof image != "string") // TODO: verify the image url 
            {
                errors.push({
                    field: "name",
                    message: "image format is wrong"
                });
            } else
                user.image = image;
        }
        if (errors.length !== 0)
            return res.status(400).json({ errors });
        await user.save();
        res.json({ message: "successfully updated the user" });
    }
)

module.exports = router;