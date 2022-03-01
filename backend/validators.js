const User = require("./models/User");
const Web3 = require("web3");

module.exports = {
    uniqueAddress(address) {
        return User.findOne({
            where: {
                address
            }
        }).then(user => {
            if (!user) {
                return Promise.reject("User nonce not generated yet");
            }
            else if (user.isRegistered) {
                return Promise.reject("User already exists");
            }
        });
    },
    uniqueUsername(username) {
        return User.findOne({
            where: {
                username
            }
        }).then(user => {
            if (user) {
                return Promise.reject("Username already exists");
            }
        });
    },
    isRegistered(address) {
        return User.findOne({
            where: {
                address
            }
        }).then(user => {
            if (!(user && user.isRegistered)) {
                return Promise.reject("User not registered");
            }
        })
    },
    isValidAddress(address) {
        if (!Web3.utils.isAddress(address)) {
            console.log("Invalid address");
            throw new Error("Invalid address");
        }
        return true;
    }
}