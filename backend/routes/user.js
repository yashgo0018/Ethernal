const express = require("express");
const { param } = require("express-validator");
const { validate } = require("../middlewares");
const { toChecksumAddress } = require("../sanitizers");
const { isValidAddress } = require("../validators");

const router = express.Router();

router.get(
    "/address/:address",
    param("address")
        .custom(isValidAddress)
        .customSanitizer(toChecksumAddress),
    validate,
    (req, res) => {
        const { address } = req.params;
        const user = User.findOne({
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
        .toString(),
    validate,
    (req, res) => {
        const { username } = req.params;
        const user = User.findOne({
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

module.exports = router;