require("dotenv/config");
const { User } = require("../models/models");
const { JSONResponse } = require("../lib/helper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    hasWhatsapp = false;
    if (req.body.whatsapp == "") {
      hasWhatsapp = false;
    } else {
      hasWhatsapp = req.body.whatsapp;
    }
    let newUser = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password,
      role: "user",
      cell: req.body.cell,
      whatsapp: hasWhatsapp,
    };
    User.find({ email: newUser.email }, (err, user) => {
      if (err) {
        JSONResponse.error(
          res,
          "Failure handling user model. Cannot create ",
          500
        );
        return;
      }
      if (!user) {
        JSONResponse.error(
          res,
          "Failure handling user model. Cannot create ",
          500
        );
        return;
      }
      User.create(newUser);
      newUser.password = undefined;
      res.json(newUser);
    });
  } catch (error) {
    JSONResponse.error(
      res,
      "Failure handling user model. Cannot create ",
      error,
      500
    );
    return;
  }
};
exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("dogs")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "This user does not exist." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      const tokenExpiration = 10 * 60;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: tokenExpiration, // 86400 - 24 hours
      });
      // var authorities = [];
      // authorities.push(user.role.toUpperCase());

      req.session.token = token;

      res.json({
        token: token,
        id: user._id,
        tokenExpires: new Date(Date.now() + tokenExpiration * 1000),
      });
    });
};
exports.logout = async (req, res) => {
  try {
    if (req.session.token) {
      req.session = null;
      return res.status(200).send({ message: "You've been signed out!" });
    } else {
      return res.status(500).send({ message: "Not logged in!" });
    }
  } catch (err) {
    this.next(err);
  }
};

exports.createUser = async (req, res) => {
  try {
    let newUser = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      cell: req.body.cell,
      whatsapp: req.body.whatsapp,
    };
    User.findOne({ email: newUser.email }, (err, user) => {
      if (err) {
        JSONResponse.error(
          res,
          "Failure handling user model. Cannot create ",
          500
        );
      }
      if (user) {
        JSONResponse.error(res, "Email address is already taken", 500);
      } else {
        const newUserChecked = User.create(newUser);
        newUserChecked.password = undefined;
        JSONResponse.success(res, "Success.", newUserChecked, 200);
      }
    });
  } catch (error) {
    JSONResponse.error(
      res,
      "Failure handling user model. Cannot create ",
      error,
      500
    );
  }
};
