const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: DataTypes.STRING,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nonce: {
        type: DataTypes.STRING
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastBlock: {
        type: DataTypes.INTEGER,
    },
    donationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    currentNonce: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: "user"
})

module.exports = User;