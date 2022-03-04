const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const sequelize = require("../database");
const { generateSlug } = require("../helpers");
const { validate } = require("../middlewares");
const { onlyAuthorized } = require("../protection_middlewares");
const { user: User, post: Post } = sequelize.models;

router.get("/:username", async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const posts = await user.getPosts();
    res.json({ posts });
});

router.get("/:username/:slug", async (req, res) => {
    const { username, slug } = req.params;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    const post = await user.getPost({ where: { slug } });
    res.json({ post });
});

router.post(
    "/create",
    onlyAuthorized,
    body("title")
        .isString()
        .isLength({ min: 4 }),
    body("body")
        .isString(),
    validate,
    async (req, res) => {
        const { user } = req;
        const { title, body } = req.body;
        // TODO: verify if the body is valid
        let slug = generateSlug(title);
        let post = await user.getPost({ where: { slug } });
        while (post) {
            slug = generateSlug(title);
            slug += `-${Math.floor(Math.random() * 9000 + 1000)}`;
            post = await user.getPost({ where: { slug } });
        }
        post = new Post({ title, slug, body });
        await post.save();
        await user.addPost(post);
        res.json({ post });
    }
);

router.put(
    "/update",
    onlyAuthorized,
    body("id")
        .isNumeric(),
    body("title")
        .isString()
        .isLength({ min: 4 }),
    body("body")
        .isString(),
    body("slug")
        .isString(),
    validate,
    async (req, res) => {
        // Todo: implement the update post function
    }
);

router.delete(
    "/delete",
    onlyAuthorized,
    body("id")
        .isNumeric(),
    async (req, res) => {
        const { user } = req;
        const { id } = req.body;
        const post = await user.getPost({ where: { id } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await Post.destroy({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    }
);

module.express = router;
