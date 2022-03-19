const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Post extends Model { }

Post.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    body: {
        type: DataTypes.TEXT
    }
}, {
    sequelize,
    modelName: "Post"
});

module.exports = Post;
