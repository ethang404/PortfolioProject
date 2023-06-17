const express = require("express");

// Creating express Router
const router = express.Router();
const axios = require("axios");
//cookie parser to use accessToken saved in cookis for youtube data API requests.
const cookieParser = require("cookie-parser");
var passport = require("passport"); //passport middleware

//fetch request here with data from req header
async function verifyToken(req, res, next) {
	const accessToken = req.headers.authorization.split(" ")[1];
	try {
		let resp = await axios.get(
			"https://oauth2.googleapis.com/tokeninfo?access_token=",
			accessToken
		);

		console.log("no problems here");
		next();
	} catch (error) {
		if (error.response.data.error == "invalid_token") {
			console.log("InvalidToken!");
		}
	}
	next();
}

async function test(req) {
	const accessToken = req.headers.authorization.split(" ")[1];
	const q = req.headers.q;
	console.log("your query is:", q);
	console.log(
		"full call is: ",
		"https://www.googleapis.com/youtube/v3/search?q=" + q + "&type=video"
	);
	let response = await axios.get(
		"https://www.googleapis.com/youtube/v3/search?q=" + q + "&type=video",
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	console.log("success!!!: ", response.data);
	console.log("testing first val: ", response.data.items[0].id);
	return response.data.items;
}

router.get("/searchVideo", verifyToken, async (req, res) => {
	const searchRes = await test(req);
	res.send(searchRes);
	//const accessToken = req.headers.authorization.split(" ")[1];
});

var returnRouter = function (io) {
	io.on("connection", (socket) => {
		console.log(`User Connected: ${socket.id}`);

		socket.on("join_room", (data) => {
			console.log("Joining room: " + data);
			socket.join(data); //joins room
		});

		socket.on("playVideo", (data) => {
			//play event to room
			console.log("playVideo-room code is " + data.room);
			socket.to(data.room).emit("user-played");
		});
		socket.on("pauseVideo", (data) => {
			//pause event to room
			console.log("pauseVideo-room code is " + data.room);
			socket.to(data.room).emit("user-paused");
		});
		socket.on("searchVideo", (data) => {
			console.log("my-Data: ", data.videoId);
			console.log("my-room: ", data.room);
			//play video(video id) event to room
			socket.to(data.room).emit("user-searched", data);
		});
		socket.on("skipVideo", (data) => {
			console.log("my-room: ", data);
			//play video(video id) event to room
			socket.to(data.room).emit("user-skipped", data);
		});
	});

	return router;
};

module.exports = returnRouter;
