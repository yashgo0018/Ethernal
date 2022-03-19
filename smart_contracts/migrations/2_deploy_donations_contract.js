const Donations = artifacts.require("Donations");

module.exports = function (deployer) {
    deployer.deploy(Donations, "0xA612F142d557ED165FBE465A45b7CAD59A8894a7");
}