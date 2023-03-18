const express = require("express");
const { google } = require("googleapis");

// Creating express Router
const router = express.Router();
const cors = require('cors');
router.use(cors({
    origin: ['https://www.section.io', 'https://www.google.com/']
}));


/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2(
	process.env.client_id,
	process.env.client_secret,
	process.env.redirect_uri
);

// Generate a url that asks permissions for the Drive activity scope
const authorizationUrl = oauth2Client.generateAuthUrl({
	// 'online' (default) or 'offline' (gets refresh_token)
	access_type: "offline",

	scope: process.env.scope,
	// Enable incremental authorization. Recommended as a best practice.
	include_granted_scopes: true,

	response_type: "code",
});

async function getAccessToken(code) {
	//google should redirect to here, we should grab the code from the URL
	//Create accessToken with the code.
	//Then res.redirect to the frontend (youtube homepage)

	//But how do rooms work??
	console.log("my route working")
	console.log("my code",code)
	//make api call to gogle to get accessToken and return
	//const resp = await fetch();
	//res.redirect()
}

// Handling login request
router.get("/login", (req, res, next) => {
	//res.send({ test: "testing" });
	console.log(req.headers.code)
	var accessToken = getAccessToken(req.headers.code);
});

router.get("/login2", (req, res, next) => {
	res.send("This is the login request number 2");
});

router.get("/JWT", (req, res) => {
	temp = testLogin();
	res.send(temp);
});

function testLogin() {
	//could make this authenticate Token function
	
	return "my JWT token!";
}

module.exports = router;
