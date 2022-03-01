const ethSigUtil = require("@metamask/eth-sig-util");
var jwt = require('jsonwebtoken');

module.exports = {
    getNonceMessage(nonce) {
        const template = process.env.NONCE_MESSAGE || "The Nonce is: %";
        return template.replace("%", nonce);
    },
    generateNonce() {
        const options = "ABCDEDFGHIJKLMNOPQRSTUVWXYZ";
        let nonce = "";
        for (let i = 0; i < 32; i++) {
            if (i != 0 && i % 8 == 0) {
                nonce += "-";
            }
            nonce += options.charAt(Math.floor(Math.random() * options.length));
        }
        return nonce;
    },
    verifySignature(data, signature, address) {
        let signer;
        try {
            signer = ethSigUtil.recoverPersonalSignature({ data, signature });
        } catch (err) {
            return false;
        }
        return signer.toLowerCase() == address.toLowerCase();
    },
    generateJWTToken(address) {
        return jwt.sign({ username: address }, process.env.JWT_SECRET);
    },
    verifyJWTToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return null;
        }
    }
}