const passport = require("passport");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			refreshToken: true, //this should get a refreshToken
		},
		function (accessToken, refreshToken, profile, done) {
			// This function is called after the user grants permission and the authorization code is exchanged for an access token
			console.log("Myprofile: ", profile);
			console.log("ACCESSTOKEN: ", accessToken);
			console.log("REFRESHTOKEN: ", refreshToken);
			done(null, { profile, accessToken, refreshToken });
		}
	)
);

passport.serializeUser((user, done) => {
	console.log("myPre user: ", user);
	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log("my user: ", user);
	done(null, user);
});
