const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
    },
    surname: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
      index: { unique: true, dropDups: true },
    },
    cell: {
      type: String,
      // required: true,
    },
    whatsapp: {
      type: Boolean,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      // required: true,
    },
    dogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dog",
      },
    ],
  },
  {
    collection: "users",
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

const User = mongoose.model("User", userSchema);

const Dog = mongoose.model(
  "Dog",

  new mongoose.Schema(
    {
      dogImage: String,
      dogImagePath: String,
      age: Number,
      shots: Number,
      price: Number,
      breed_1: String,
      breed_2: String,
      gender: String,
      uploadDate: String,
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      collection: "dogs",
    }
  )
);

module.exports = {
  User,
  Dog,
};
