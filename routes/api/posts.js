const express = require("express");
const router = express.Router();
// const { check, validationResult } = require("express-validator/check");
const middleware = require("../../middleware/middleware");

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route   GET api/posts
// @desc    Create a post
// @access  Public
router.post("/", middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };
    console.log(newPost);
    const post = new Post(newPost);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", middleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get("/:id", middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // Check user
    // if (post.user.toString !== req.user.id) {
    //   return res.status(401).json({ msg: "User not authorized" });
    // }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put("/like/:id", middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    let index = null;
    console.log("============\n\n\n\n\n");
    console.log(post.likes);
    // Check if post has already been liked by this user
    if (
      post.likes.length > 0 &&
      post.likes.map((like, i) => {
        if (like.user.toString() === req.user.id) {
          index = i;
          post.likes.splice(index, 1);
          console.log("found user");
        }
      })
    ) {
      await post.save();
      console.log("unliked");
      return res.status(200).json({ msg: post.likes });
    }
    post.likes.unshift({ user: req.user.id });
    console.log("liked");
    await post.save();

    res.status(200).json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/comment/:id
// @desc    Comment on a post
// @access  Public
router.post("/comment/:id", middleware, async (req, res) => {
  console.log("Here");
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };
    post.comments.unshift(newComment);

    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/posts/:id
// @desc    Delete a comment
// @access  Private
router.delete("/comment/:id/:comment_id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log(post);
    let idx = null;
    post.comments.length > 0 &&
      post.comments.map((comment, index) => {
        if (comment.id.toString() === req.params.comment_id) {
          console.log(idx);
          idx = index;
          post.comments.splice(idx, 1);
        }
      });
    idx = null;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
