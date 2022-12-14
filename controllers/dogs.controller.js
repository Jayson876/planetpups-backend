const { JSONResponse } = require("../lib/helper");
const { User, Dog } = require("../models/models");
var fs = require("fs");

const multer = require("multer");
const { ifError } = require("assert");

upload = multer({
  dest: "tmp/images",
});

function breedTest(breed) {
  if (breed === "Pure") {
    return "";
  }
  if (breed === "Mixed") {
    return /.*\S.*/;
  }
  return /(.*?)/;
}

function genderTest(gender) {
  if (gender === "Male") {
    return "Male";
  }
  if (gender === "Female") {
    return "Female";
  }
  return /(.*?)/;
}

exports.createDog = async (req, res) => {
  try {
    const userID = req.user._id;
    let newDog = {
      age: req.body.age,
      shots: req.body.shots,
      price: req.body.price,
      breed_1: req.body.breed_1,
      breed_2: req.body.breed_2,
      owner: userID,
    };
    if (req.file) {
      newDog.dogImage = req.file.filename;
      newDog.dogImagePath = req.file.path;
    }
    Dog.create(newDog, async (error, data) => {
      if (error) {
        JSONResponse.error(res, " Cannot create ", 500);
      } else {
        User.findOneAndUpdate(
          userID,
          { $push: { dogs: data._id } },
          { upsert: true },

          (error, data) => {
            if (error) {
              JSONResponse.error(res, " Cannot create ", error, 500);
            } else {
              JSONResponse.success(res, "Success created dog post.", data, 200);
            }
          }
        );
      }
    });
  } catch (error) {
    JSONResponse.error(res, "An error has occurred.", error, 500);
  }
};

exports.getAllDogs = async (req, res) => {
  try {
    const checkQuery = Object.values(req.query);
    if (checkQuery.length > 0) {
      const dogs = await Dog.aggregate([
        { $match: { gender: genderTest(req.query.gender) } },
        { $match: { breed_2: breedTest(req.query.breed ?? "") } },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
      ]);
      if (+req.query.price === 1) {
        dogs.sort((a, b) => {
          return a.price > b.price ? -1 : 0;
        });
        // res.json(sortedDogs);
      } else if (+req.query.price === -1) {
        dogs.sort((a, b) => {
          return a.price > b.price ? 0 : -1;
        });
      }
      res.json(dogs);
    } else {
      const dogs = await Dog.find({}).populate("owner");
      res.json(dogs);
    }
  } catch (error) {
    JSONResponse.error(res, "Failure getting dog model.", error, 500);
  }
};

exports.getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById({ _id: req.params.id }).populate("owner");
    dog.owner.password = undefined;
    res.json(dog);
  } catch (error) {
    JSONResponse.error(res, "Failure getting dog model.", error, 500);
  }
};

exports.updateDog = async (req, res) => {
  try {
    let userInput = {
      age: req.body.age,
      shots: req.body.shots,
      gender: req.body.gender,
      price: req.body.price,
      breed_1: req.body.breed_1,
      breed_2: req.body.breed_2,
    };
    if (req.file) {
      let thisDog = await Dog.findById({ _id: req.params.id });
      var fileName = thisDog.dogImagePath;
      var filePath = `${fileName}`;
      fs.rmSync(filePath, {
        force: true,
      });
      userInput.dogImage = req.file.filename;
      userInput.dogImagePath = req.file.path;
    }
    Dog.findByIdAndUpdate(req.params.id, userInput)
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
// exports.updateDog = async (req, res) => {
//   try {
//     Dog.findByIdAndUpdate(req.params.id, req.body)
//       .then((result) => {
//         if (result) {
//           res.json(result);
//         } else {
//           JSONResponse.error(
//             res,
//             "Failure updating user.",
//             new Error("Document not successfully updated."),
//             409
//           );
//         }
//       })
//       .catch((error) => {
//         JSONResponse.error(
//           res,
//           "Fatal error accessing database.",
//           error.message,
//           500
//         );
//       });
//   } catch (error) {
//     JSONResponse.error(res, "Failure handling user model.", error, 500);
//   }
// };

exports.deleteDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (dog) {
      var fileName = dog.dogImagePath;
      var filePath = `${fileName}`;
      fs.rmSync(filePath, {
        force: true,
      });
      await dog.delete();
      JSONResponse.success(res, "Success.", dog, 200);
    }
  } catch (error) {
    JSONResponse.error(res, "Failure handling dog model.", error, 500);
  }
};
exports.getAllUserDogs = async (req, res) => {
  try {
    const dog = await Dog.find({
      owner: req.params.id,
    }).populate("owner");
    if (!dog) {
      JSONResponse.error(res, "No dogs available.", 401);
    }
    res.json(dog);
  } catch (error) {
    JSONResponse.error(res, "Failure getting user model.", error, 500);
  }
};
exports.createUserDog = async (req, res) => {
  try {
    const dogData = req.body;
    // console.log(dogData);
    await User.findById({ _id: req.params.id }).then(async (user) => {
      if (!user.email) {
        JSONResponse.error(res, "This user does not exist.", 401);
        return done(null, false);
      } else {
        const userID = req.params.id;
        let newDog = {
          age: req.body.age,
          shots: req.body.shots,
          price: req.body.price,
          breed_1: req.body.breed_1,
          breed_2: req.body.breed_2,
          gender: req.body.gender,
          uploadDate: new Date().toLocaleDateString(),
          owner: userID,
        };
        if (req.file) {
          newDog.dogImage = req.file.filename;
          newDog.dogImagePath = req.file.path;
        }

        Dog.create(newDog, async (error, data) => {
          if (error) {
            JSONResponse.error(res, " Cannot create ", error, 500);
          } else {
            User.findOneAndUpdate(
              userID,
              { $push: { dogs: data._id } },
              { upsert: true },

              (error, data) => {
                if (error) {
                  JSONResponse.error(res, " Cannot create ", error, 500);
                } else {
                  JSONResponse.success(
                    res,
                    "Success created dog post.",
                    data,
                    200
                  );
                }
              }
            );
          }
        });
      }
    });
  } catch (error) {
    JSONResponse.error(res, "An error has occurred..", error, 500);
  }
};
