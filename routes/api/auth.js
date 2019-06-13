const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const Nexmo = require("nexmo");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const User = require("../../models/User");
const nexmo = new Nexmo(
  {
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
  },
  { debug: true }
);

// @route   GET api/auth
// @desc    Test route
// @access  Private
router.get("/", middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// @route   GET api/auth/phone
// @desc    Send SMS
// @access  Public
router.post("/phone", async (req, res) => {
  try {
    const { number, text } = req.body;
    nexmo.message.sendSms(
      "George",
      number,
      text,
      { type: "unicode" },
      (err, res) => {
        if (err) {
          console.error(err);
        } else {
          console.dir(res);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// @route GET api/auth/recover
// @desc Find user and send an email with a reset password token
// @access Public
router.post("/recover", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: "No user found" });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
      if (error) throw error;
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
    });
    await user.save();

    const mailmsg = {
      to: user.email,
      from: "WEB DEV OFFICE <homelessjack@outlook.com>",
      subject: "web Forgot Password/Reset",
      html: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or copy and paste it into your browser to complete the process:
      <a href="http://${req.headers.host}/api/auth/reset/${
        user.resetPasswordToken
      }">Click Here to reset your password</a>
    	If you did not request this, please ignore this email and your password will remain unchanged.`.replace(
        /				/g,
        ""
      )
    };

    await sgMail.send(mailmsg);
    return res.status(200).json({
      msg: "Success"
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// @route GET api/auth/reset/:token
// @desc Reset the password
// @access Private
router.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (user.isModifiable) {
      const { password, confirm } = req.body;
      if (password === confirm) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.isModifiable = false;
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
          if (error) throw error;
          res.cookie("token", token, { httpOnly: true }).status(200);
        });

        await user.save();
      }
    }
    res.status(200).json({ msg: "Password updated" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

// @route GET api/auth/reset/:token
// @desc Find user and send an email with a reset password token
// @access Private
router.get("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Password reset token is invalid or has expired" });
    }

    user.isModifiable = true;
    await user.save();

    // @todo Insert token into headers before redirecting to a secure route

    res.status(200).json({ msg: "Validated" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("here");
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };
      let arr = [];

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (error, token) => {
          if (error) throw error;
          arr.push();
          res
            // .header("Set-Cookie", [
            //   `devToken=${token}; Expires=Fri, 26 Dec 2021 17:23:52 GMT, Path="/"`
            //   // `location=Paris;Expires=Fri, 26 Dec 2010 17:23:52 GMT`,
            // ])
            .status(200)
            .json({ token });
          console.log("Headers:\n", res.header);
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
