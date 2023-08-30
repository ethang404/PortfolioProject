const express = require("express");
require("dotenv").config();
var passport = require("passport");
const cookieParser = require("cookie-parser");
const axios = require("axios");
//const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// Creating express Router
const router = express.Router();

router.get("/success", (req, res) => {
	console.log("access: ", req.user.accessToken);
	// Save accessToken in session
	req.session.accessToken = req.user.accessToken;
	console.log("session object:", req.session.accessToken);

	console.log("myVal", req.isAuthenticated());
	res.cookie("accessToken", req.user.accessToken, { maxAge: 24 * 60 * 60 * 1000 }); // 1 day
	console.log("Cookie set!");
	console.log(req.cookies.accessToken);

	console.log("saving refreshToken.. ");
	console.log(req.user);
	//httpOnly:true below
	res.cookie("refreshToken", req.user.refreshToken, {
		maxAge: 24 * 60 * 60 * 1000,
	}); // 1 day

	/*res.redirect(
		"http://localhost:3000/Project/YoutubeApp/Home?accessToken=" + req.session.accessToken
	);*/
	res.redirect("https://legendary-gecko-c5294f.netlify.app/Project/YoutubeApp/Home");
});
router.get("/error", (req, res) => res.send("error logging in"));

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "https://www.googleapis.com/auth/youtube"],
		accessType: "offline",
		//approvalPrompt: "force",
		prompt: "consent",
	})
); //this navigates to the consent screen to
//get code from user profile

//Call passport.authenticate again(now with code after consent screen) and obtain profile data(and accessToken)
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/auth/error" }),
	function (req, res) {
		//console.log(req.user);
		//console.log("MY TOKEN: ", req.user.accessToken);
		//console.log("accessing accessToken in callback!...going to redirect to forntend now");
		//const accessToken = req.user.accessToken;
		//res.cookie("accessToken", accessToken);
		// This function is called after the user grants permission and the authorization code is exchanged for an access token
		res.redirect("http://18.209.103.169:8080/auth/success");
		//res.redirect("http://localhost:3000/Project/YoutubeApp/Home");
	}
);

router.get("/", (req, res) => {
	console.log("testy22: ", req.session.accessToken);
	console.log(req.isAuthenticated());
	console.log("test2");
	console.log(process.env.GOOGLE_CLIENT_ID);

	res.send("This is the youtube HOME request");
});
router.get("/error", (req, res) => {
	console.log("Error authenticating");

	res.status(500).send("Error: user not valid");
});

router.get("/validToken", async (req, res) => {
	const accessToken = req.headers.authorization.split(" ")[1];
	console.log("my accessToken: ", accessToken);
	try {
		let response = await axios.get(
			"https://oauth2.googleapis.com/tokeninfo?access_token=" + accessToken
		);
		if (response.data.error) {
			console.log("aww bad token");
			res.status(403).send("Error: invalidToken");
		} else {
			console.log("yay! good token");
			res.status(200).send("Success: token is valid");
		}
	} catch (error) {
		console.log("something went wrong: ", error.message);
		res.send(error.message);
		//res.status(500).send("Something went wrong", error.message);
	}
});

module.exports = router;
