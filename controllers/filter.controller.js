const { JSONResponse } = require("../lib/helper");
const { User, Dog } = require("../models/models");

exports.byBreed = async (req, res) => {
  Dog.find()
    .or([{ breed_1: req.body.search }, { breed_2: req.body.search }])
    .then((dogs) => {
      res.json(dogs);
    })
    .catch((error) => {
      console.log(error);
    });
};
