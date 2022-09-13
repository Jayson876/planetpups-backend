let express = require("express");
const controller = require("../controllers/users.controller");
const { User } = require("../models/models");
const authJwt = require("../auth/middlewares/authJwt");
const upload = require("../auth/middlewares/upload");
const verifyRegistration = require("../auth/middlewares/verifyRegister");

let router = express.Router();


router.delete("/:id/dog", controller.deleteUserDog);
// router.delete("/:id/dog", [authJwt.verifyToken], controller.deleteUserDog);

// Get all user
// router.get("/", [authJwt.verifyToken], controller.getAllUsers);
router.get("/", controller.getAllUsers);

// Get a single user
router.get("/:id", controller.getUserById);
// router.get("/:id", [authJwt.verifyToken], controller.getUserById);

// Create user
router.post(
  "/",
  [verifyRegistration.checkDuplicateUsernameOrEmail],
  controller.createUser
);
// router.post(
//   "/",
//   [authJwt.verifyToken],
//   [authJwt.isAdmin],
//   controller.createUser
// );

// Update user
router.put("/:id",  upload.single('avatar'), controller.updateUser);
// router.put('/:id',  upload.single('avatar'),[authJwt.verifyToken], controller.updateUser);

// Delete user
router.delete("/:id", controller.deleteUserById);
// router.delete('/:id', [authJwt.verifyToken], controller.deleteUserById);

module.exports = router;
