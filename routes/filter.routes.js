let express = require("express");
let router = express.Router();
const dogFilter = require("../controllers/filter.controller");

// Filter
router.get("/dogs", dogFilter.byQuery);

module.exports = router;