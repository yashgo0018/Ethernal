const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Donation extends Model { }

Donation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    donorAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transactionHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastBlock: {
        type: DataTypes.INTEGER,
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: true
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "donation"
});

module.exports = Donation;