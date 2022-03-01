const { Sequelize, Model } = require("sequelize");
const sequelize = require("../database");

class User extends Model { }

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: Sequelize.STRING,
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nonce: {
        type: Sequelize.STRING
    },
    isRegistered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "user"
})

module.exports = User;