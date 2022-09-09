let express = require("express");
const controller = require("../controllers/auth.controller");
const verifyRegistration = require("../auth/middlewares/verifyRegister");

let router = express.Router();


router.post(
  "/register",
  [verifyRegistration.checkDuplicateUsernameOrEmail],
  controller.register
);

router.post("/login", controller.login);
router.get("/logout", controller.logout);

module.exports = router;
