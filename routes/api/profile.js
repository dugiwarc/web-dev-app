const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/:me
// @desc    Get current user' profile
// @access  Profile
router.get("/me", middleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "No profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// @route   POST api/profile/
// @desc    Create or update an user' profile
// @access  Private
router.post("/", middleware, async (req, res) => {
  const { location, experience, status, skills, user } = req.body;

  const profileFields = {};
  profileFields.user = req.user.id;
  if (skills) {
    profileFields.skills = skills.split(",").map(skill => skill.trim());
  }
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error);
  }
});

// @route   GET api/profile/
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json({ msg: "There is no profile for this user" });

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/profile/
// @desc    Delete, profile, user, posts
// @access  Private
router.delete("/", middleware, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User removed" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   Put api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put("/github/:username", middleware, async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?
      per_page=5&sort=created:asc&client_id=${process.env.GITHUB_ID}&
      client_secret=${process.env.GITHUB_SECRET}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };
    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found!" });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error.message);
  }
});
module.exports = router;
