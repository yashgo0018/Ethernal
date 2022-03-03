const express = require("express");
const { body } = require("express-validator");
const sequelize = require("../database");
const { validate } = require("../middlewares");
const { toChecksumAddress } = require("../sanitizers");
const { isValidAddress } = require("../validators");
const { user: User, donation: Donation } = sequelize.models;
const router = express.Router();

router.get("/username/:username", async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    console.log(user);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const donations = await user.getDonations({ where: { confirmed: true } });

    res.json({ donations });
})

router.post(
    "/create-donation",
    body("donorAddress")
        .custom(isValidAddress)
        .customSanitizer(toChecksumAddress),
    body("receiverAddress")
        .custom(isValidAddress)
        .customSanitizer(toChecksumAddress),
    body("transactionHash")
        .matches(/^0x([A-Fa-f0-9]{64})$/)
        .withMessage("invalid transaction hash"),
    body("name")
        .isString(),
    body("message")
        .isString(),
    validate,
    async (req, res) => {
        const { donorAddress, receiverAddress, transactionHash, name, message } = req.body;
        if (donorAddress == receiverAddress) {
            return res.status(400).json({ message: "one cannot donate to himself" });
        }
        const user = await User.findOne({ where: { address: receiverAddress } });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "receiver not a member" });
        }
        const donation = new Donation({
            donorAddress,
            transactionHash,
            name,
            message
        });
        await donation.save();
        await donation.setUser(user);
        res.json({ message: "donation registered" });
    }
);

module.exports = router;