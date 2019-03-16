const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user/UserController");

const extractImage = require("../middleware/image");


router.post("/signup", extractImage, UserController.createUser);

router.post("/login", UserController.userLogin);


module.exports = router;