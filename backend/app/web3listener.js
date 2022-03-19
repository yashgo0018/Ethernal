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

class DBQueue {
    list = [];
    locked = false;
    async run(fun) {
        if (!this.locked) {
            this.locked = true;
            await fun();
            this.locked = false;
            if (this.list.length != 0) {
                this.run(this.list.shift());
            }
        } else {
            this.list.push(fun);
        }
    }
}

async function getOrCreateUser(address) {
    address = toChecksumAddress(address);
    let user = await User.findOne({
        where: { address }
    });
    if (user) return user;
    try {
        user = await sequelize.transaction(async (t) => {
            const user = new User({
                address,
                nonce: generateNonce()
            });
            await user.save({ transaction: t });
            return user;
        })
    } catch (err) {
        user = await User.findOne({
            where: { address }
        });
    }
    return user;
}

// Define the event listeners
module.exports = async () => {
    const queue = new DBQueue();
    const user = await User.findOne({
        order: [
            ['lastBlock', 'DESC']
        ]
    });
    let fromBlock = user ? user.lastBlock : 0;
    console.log(fromBlock);
    donationsContract.events.MemberStatusChange({ fromBlock }).on("data", async ({ returnValues, blockNumber, transactionHash }) => {
        let user = await getOrCreateUser(returnValues.member);
        user.currentNonce = returnValues.nonce;
        user.donationsEnabled = returnValues.status;
        user.lastBlock = parseInt(blockNumber);
        user.save();
    });
    const donation = await Donation.findOne({
        order: [
            ['lastBlock', 'DESC']
        ]
    });
    fromBlock = donation ? donation.lastBlock : 0;
    donationsContract.events.DonationMade({ fromBlock }).on("data", async ({ returnValues, blockNumber, transactionHash }) => {
        // get or create a user
        let user = await getOrCreateUser(returnValues.receiver);

        // delete all the donations with the same transaction hash but different donor or different receiver
        await Donation.destroy({
            where: {
                transactionHash,
                [Op.not]: [
                    { donorAddress: returnValues.donor },
                    { userId: user.id }
                ]
            },
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
        donation.amount = returnValues.amount.toString();
        donation.confirmed = true;
        donation.lastBlock = parseInt(blockNumber);
        await donation.save();
    });
}