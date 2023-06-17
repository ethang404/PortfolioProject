const express = require("express"); //import express
const session = require("express-session");
const app = express(); //express server
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = 8080;
const passportSetup = require("./passport");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const cors = require("cors"); //install cors
app.use(
	session({
		secret: "my-secret-key",
		resave: true,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const loginroute = require("./routes/auth"); //import routing from routes/login
const youtubeRoutes = require("./routes/youtube")(io);

app.use(cors());

// Handling routes request for login functions(including JWT tokens)
app.get("/", (req, res) => {
	console.log(process.env.GOOGLE_CLIENT_SECRET);
	res.send("test home page");
});

app.use("/auth", loginroute);
app.use("/yt", youtubeRoutes);

server.listen(PORT, function (err) {
	if (err) console.log("Error in server setup");
	console.log("Server listening on Port", PORT);
});
