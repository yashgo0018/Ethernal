// Import Dependencies
const Web3 = require("web3");
const donationsContractABI = require("./abis/Donations.json");
const sequelize = require("./database");
const { generateNonce } = require("./helpers");
const { donation: Donation, user: User } = sequelize.models;
const { Op } = require("sequelize");
const { toChecksumAddress } = require("./sanitizers");

// Get ENV Variables
const WEB3_RPC = process.env.WEB3_RPC;
const DONATIONS_CONTRACT_ADDRESS = process.env.DONATIONS_CONTRACT_ADDRESS;

// Setup 
const web3 = new Web3(WEB3_RPC);
const donationsContract = new web3.eth.Contract(donationsContractABI, DONATIONS_CONTRACT_ADDRESS);

// Define the event listeners
module.exports = async () => {
    donationsContract.events.DonationMade({}).on("data", async ({ returnValues, transactionHash }) => {
        // get or create a user
        let user = await User.findOne({
            where: {
                address: returnValues.receiver
            }
        });
        if (!user) {
            user = new User({
                address: toChecksumAddress(returnValues.receiver),
                nonce: generateNonce()
            });
            await user.save();
        }

        // delete all the donations with the same transaction hash but different donor or different receiver
        await Donation.destroy({
            where: {
                transactionHash,
                [Op.not]: [
                    { donorAddress: returnValues.donor },
                    { user_id: user.id }
                ]
            }
        });

        // get the donation list
        const donations = await user.getDonations({ where: { transactionHash }, order: [['id', 'DESC']] });
        let donation = donations[0];

        // delete the rest of donations
        for (const obj of donations.slice(1)) {
            await Donation.destroy({ where: { id: obj.id } });
        }

        // create new donation object if not present already
        if (!donation) {
            donation = new Donation({
                transactionHash,
                donorAddress: returnValues.donor
            });
            await donation.save();
            await user.addDonation(donation);
        }

        // update the donation status and amount
        donation.amount = returnValues.amoount.toString();
        donation.confirmed = true;
        await donation.save();
    })
}