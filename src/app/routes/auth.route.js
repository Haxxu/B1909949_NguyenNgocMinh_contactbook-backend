const express = require("express");
const users = require("../controllers/user.controller");

const router = express.Router();

router.post("/login", users.login);

module.exports = router;
