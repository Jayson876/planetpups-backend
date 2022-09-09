const { User } = require("../../models/models");

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Email
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "This email is already taken" });
      return;
    }
    next();
  });
};
const verifyRegistration = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifyRegistration;
