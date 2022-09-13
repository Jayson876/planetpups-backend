const { JSONResponse } = require("../lib/helper");
const { Dog } = require("../models/models");

exports.byBreed = async (req, res) => {
  try {
    const dogs = await Dog.find({
      $or: [
        { breed_1: { $regex: req.params.search, $options: "i" } },
        { breed_2: { $regex: req.params.search, $options: "i" } },
      ],
    }).populate("owner");
    res.json(dogs);
  } catch (err) {
    console.log(err);
  }
};


