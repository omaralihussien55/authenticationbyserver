const express = require("express");
const router =express.Router();
const userControler = require("../controller/userControler");
const verifyJwt = require("../middleware/verifyJwt");

router.use(verifyJwt);
router.route("/").get(userControler.getAllUser);

module.exports = router