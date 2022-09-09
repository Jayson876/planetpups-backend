const { JSONResponse } = require("../lib/helper");
const { User, Dog } = require("../models/models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("dogs");
    users.forEach((user) => {
      user.password = undefined;
    });
    JSONResponse.success(res, "Success.", users, 200);
  } catch (error) {
    JSONResponse.error(res, "Failure getting user model.", error, 500);
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id }).populate("dogs");
    user.password = undefined;
    res.json(user);
  } catch (error) {
    JSONResponse.error(res, "Failure getting user model.", error, 500);
  }
};
exports.createUser = async (req, res) => {
  try {
    hasWhatsapp = false;
    if (req.body.whatsapp == "") {
      hasWhatsapp = false;
    } else {
      hasWhatsapp = req.body.whatsapp;
    }
    let newUser = {
      firstName: req.body.firstName.trim(),
      surname: req.body.surname.trim(),
      email: req.body.email.trim(),
      password: req.body.password,
      role: req.body.role.trim(),
      cell: req.body.cell.trim(),
      whatsapp: hasWhatsapp,
    };
    await User.findOne({ email: newUser.email }, (err, user) => {
      if (err) {
        JSONResponse.error(
          res,
          "Failure handling user model. Cannot create ",
          500
        );
        return;
      }
      if (user) {
        JSONResponse.error(res, "Email address is already taken", 500);
        return;
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
exports.updateUser = async (req, res) => {
  try {
    User.findByIdAndUpdate(req.params.id, req.body)
      .then((result) => {
        if (result) {
          res.json(result);
        } else {
          JSONResponse.error(
            res,
            "Failure updating user.",
            new Error("Document not successfully updated."),
            409
          );
        }
      })
      .catch((error) => {
        JSONResponse.error(
          res,
          "Fatal error accessing database.",
          error.message,
          500
        );
      });
  } catch (error) {
    JSONResponse.error(res, "Failure handling user model.", error, 500);
  }
};
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.delete();
      await Dog.deleteMany({ owner: req.params.id });
      user.password = undefined;
      JSONResponse.success(res, "Success.", user, 200);
    }
  } catch (error) {
    JSONResponse.error(res, "Failure handling user model.", error, 500);
  }
};
exports.deleteUserDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (dog) {
      await dog.delete();
      JSONResponse.success(res, "Successfully Deleted.", dog, 200);
    }
  } catch (error) {
    JSONResponse.error(res, "An error has occurred.", error, 500);
  }
};
