const Web3 = require('web3');

module.exports = {
    toChecksumAddress(address) {
        try {
            return Web3.utils.toChecksumAddress(address);
        } catch (err) {
            return address;
        }
    }
}
