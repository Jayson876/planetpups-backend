let express = require("express");
const controller = require("../controllers/dogs.controller");
const dogFilter = require("../controllers/filter.controller");
const authJwt = require("../auth/middlewares/authJwt");
let router = express.Router();
const upload= require("../auth/middlewares/upload")

// Get all user dogs
router.get("/user/:id", controller.getAllUserDogs);
// router.get("/user/:id", [authJwt.verifyToken], controller.getAllUserDogs);

// Create User Dog
router.post("/user/:id", upload.single('dogImage'),  controller.createUserDog);
// router.post("/user/:id", upload.single('dogImage'), [authJwt.verifyToken], controller.createUserDog);

// Get all dogs
router.get("/", controller.getAllDogs);

// Get a single dog
router.get("/:id", controller.getDogById);

// Create dog
// router.post("/", upload.single('dogImage'), controller.createDog);

// Update dog
router.put("/:id", controller.updateDog);

// Delete dog
router.delete("/:id", controller.deleteDogById);

// Filter
router.get("/filter", dogFilter.byBreed);

module.exports = router;
