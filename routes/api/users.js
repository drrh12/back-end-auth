const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

//@route GET api/users, public, register new user
//Entender promises e mudar para async await
router.get("/", (req, res) => {
  User.find()
    .sort({ date: -1 })
    .then(user => res.json(user));
});

router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // simple validation
  if (!name || !email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }
  // check existing user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "user already exists" });

    const newUser = new User({
      name,
      email,
      password
    });

    //hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {

          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            {expiresIn: 3600},
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
