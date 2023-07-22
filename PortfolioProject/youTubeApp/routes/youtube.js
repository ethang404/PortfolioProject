const express = require("express");

// Creating express Router
const router = express.Router();
const axios = require("axios");

async function refreshAccessToken(refreshToken) {
	try {
		const response = await axios.post("https://oauth2.googleapis.com/token", {
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		});

		// The response will contain a new access token
		const accessToken = response.data.access_token;
		console.log("Grabbing a new access token");
		// Optionally, you can also receive a new refresh token if the previous one has expired

		// Return the new access token
		return accessToken;
	} catch (error) {
		console.error("Error refreshing access token:", error);
		throw new Error("Failed to refresh access token");
	}
}

//fetch request here with data from req header
async function verifyToken(req, res, next) {
	const token = req.headers.authorization.split(" ")[1];
	//token = null;
	if (!token) {
		return res.status(401).json({ error: "Missing token" });
	}

	try {
		const response = await axios.get(
			`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`
		);
		const tokenInfo = response.data;

		// Check if the token is valid
		if (tokenInfo.error) {
			console.log("TESTINGINGG: " + response.data);
			const refreshedToken = await refreshAccessToken(req.cookies.refreshToken);
			if (!refreshedToken) {
				return res.status(401).json({ error: "Invalid token" });
			}
			// Add the refreshed access token to the request object
			req.tokenInfo = {
				...tokenInfo,
				access_token: refreshedToken,
			};

			// Proceed to the next middleware or route handler
			next();
		} else {
			// Add the token info to the request object for future use if needed
			req.tokenInfo = tokenInfo;

			// Proceed to the next middleware or route handler
			next();
		}
	} catch (error) {
		console.error("Error verifying token:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
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
	console.log("returning vals...", searchRes[0].id);
	res.send(searchRes);
	//const accessToken = req.headers.authorization.split(" ")[1];
});

router.get("/testingURL", (req, res) => {
	console.log(req.cookies.refreshToken);
	const accessToken = req.cookies.accessToken;

	console.log(JSON.stringify(req.cookies));

	// Use the accessToken in your logic
	console.log("tesing my accessToken in youtube.js");
	console.log(accessToken);
	res.send(JSON.stringify(accessToken));
});

var watchObject = {}; //could also store in session?

router.get("/loadWatchList", verifyToken, (req, res) => {
	console.log("loading current watchObjectList: ", watchObject);
	let tempRoom = req.headers.room;
	let tempVidCount = req.headers.videoCount;
	if (tempRoom in watchObject) {
		res.send(watchObject[tempRoom]); //send back as [[watchList]videoIndex] -- [[tlyer1,speedy]4]
	} else {
		res.send([]);
	}

	//const accessToken = req.headers.authorization.split(" ")[1];
});

var returnRouter = function (io) {
	io.on("connection", (socket) => {
		console.log(`User Connected: ${socket.id}`);

		socket.on("join_room", (data) => {
			console.log("----------------------------------");
			console.log("Joining room: " + data);
			socket.join(data); //joins room
			console.log(data);

			//add socket.emit to return watchObject data to the new user when joining an already filld room
			if (Object.keys(watchObject).length > 0) {
				console.log("new-user: " + watchObject[data]);
				socket.to(data.room).emit("new-user", data);
				//socket.to(data.room).emit("new-user", watchObject[data]);
			}
		});

		socket.on("playVideo", (data) => {
			//play event to room
			console.log("playVideo-room code is " + data.room);
			socket.to(data.room).emit("user-played");
		});

		socket.on("updateTime", (data) => {
			//play event to room
			console.log("backend--currentTime is " + data.currentTime);
			socket.to(data.room).emit("update-time", data.currentTime);
		});

		socket.on("pauseVideo", (data) => {
			//pause event to room
			console.log("pauseVideo-room code is " + data.room);
			socket.to(data.room).emit("user-paused");
		});
		socket.on("searchVideo", (data) => {
			console.log("my-Data(videoId): ", data.videoId);
			console.log("my-room: ", data.room);

			//add to watchObject to send to users whom join late
			/*if (data.room in watchObject) {
				let tempRoom = data.room;
				watchObject.tempRoom.push(data.videoId);
				//watchObject[data.room].push(data.videoId);
			} else {
				watchObject[data.room] = [data.videoId];
			}*/
			if (watchObject[data.room] == null) {
				watchObject[data.room] = [];
			}

			watchObject[data.room].push(data.videoId);
			console.log("searchVideo: ", watchObject);
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
