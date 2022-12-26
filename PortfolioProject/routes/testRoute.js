const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("Default url in testRoute");
});

router.get("/Test1", (req, res) => {
	res.send("GET Request Called--test");
});

module.exports = router;
