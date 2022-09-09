const usersRoute = require("./users.routes");
const dogsRoute = require("./dogs.routes");
const authRoute = require("./auth.routes");

let express = require("express");
let router = express.Router();

router.use("/auth", authRoute);
router.use("/users", usersRoute);
router.use("/dogs", dogsRoute);

module.exports = router;
