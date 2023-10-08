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
		console.log("New accessToken: ", accessToken);
		return accessToken;
	} catch (error) {
		console.error("Error refreshing access token:", error);
		throw new Error("Failed to refresh access token");
	}
}

//fetch request here with data from req header
async function verifyToken(req, res, next) {
	console.log("do I have a token: ", req.cookies.accessToken); //accessToken is not stored at this point for some reason
	console.log("do I have a token2: ", JSON.stringify(req.cookies)); //accessToken is not stored at this point for some reason
	console.log("do I have a token3: ", JSON.stringify(req.session.accessToken)); //accessToken is not stored at this point for some reason
	console.log("verifyToken accessToken: ", req.headers);
	//const token = req.headers.authorization.split(" ")[1];
	let token = req.cookies.accessToken;
	let refreshToken = req.cookies.refreshToken;
	if (!token) {
		return res.status(401).json({ error: "Missing token" });
	}

	if (!refreshToken) {
		return res.status(401).json({ error: "Missing refreshToken" });
	}

	try {
		let response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
		const tokenInfo = response.data;
		console.log("myTokenInfo: ", tokenInfo);
		// Check if the token is valid
		if (!tokenInfo.error) {
			next();
		}
	} catch (error) {
		// Check if the error response is for an invalid token
		if (
			//if token is invalid: refresh token
			error.response &&
			error.response.status === 400 &&
			error.response.data.error === "invalid_token"
		) {
			console.log("my refreshToken: ", req.cookies.refreshToken); //refreshToken is undefined
			const refreshedToken = await refreshAccessToken(req.cookies.refreshToken);
			console.log("new my accessToken: ", refreshedToken);
			if (!refreshedToken) {
				console.log("INVALID-Token on backend");
				return res.status(401).json({ error: "Invalid token" });
			}

			res.cookie("accessToken", refreshedToken, {
				maxAge: 24 * 60 * 60 * 1000,
				httpOnly: true,
			}); // 1 day
			next();
			return;
			//console.log("Token verification failed: Invalid token");
			//return res.status(401).json({ error: "Invalid token" });
			//return res.status(201).json({ access: "refreshToken" });
		}
		//else some other error
		console.error("Error verifying token:", error.response.data);
		//return res.status(500).json({ error: "Internal server error" });
	}
}

async function test(req) {
	const q = req.headers.q;

	console.log("myAccessToken in test: ", req.cookies.accessToken);
	console.log("your query is:", q);
	console.log(
		"full call is: ",
		"https://www.googleapis.com/youtube/v3/search?q=" + q + "&type=video"
	);
	try {
		let response = await axios.get(
			"https://www.googleapis.com/youtube/v3/search?q=" + q + "&type=video",
			{
				headers: {
					Authorization: `Bearer ${req.cookies.accessToken}`,
				},
			}
		);
		return response.data.items;
	} catch (e) {
		console.log("Something went wrong with searching..", e);
		//what happens if I do res.send(500) here?
		throw new Error("An error occurred in search function", e);
	}

	console.log("success!!!: ", response.data);
	console.log("testing first val: ", response.data.items[0].id);
	return response.data.items;
}
function verifyWatchObject(req, res, next) {
	const currentTime = Date.now();
	let expireTime = 8640000;
	if (
		watchObject[req.headers.room] &&
		currentTime - watchObject[req.headers.room].timestamp >= expireTime
	) {
		console.log("expired watch object");
		watchObject[req.headers.room] = null;
	}
	next();
}

// Endpoint just to verify the token
router.get("/verifyToken", verifyToken, (req, res) => {
	res.sendStatus(200); // If the middleware didn't throw an error, the token is valid
});

router.get("/searchVideo", verifyToken, verifyWatchObject, async (req, res) => {
	//for some reason the req.cookies.accessToken is not being applied
	console.log("current accessToken in searchVideo: ", req.cookies.accessToken);
	try {
		const searchRes = await test(req);
		console.log("returning vals...", searchRes[0].id);
		res.send(searchRes);
	} catch (e) {
		console.log("Error with searching(in /searchVideo", e);
		res.status(500).send("An error occurred while processing the search query");
	}
	//const accessToken = req.headers.authorization.split(" ")[1];
});
router.get("/logout", verifyToken, async (req, res) => {
	//for some reason the req.cookies.accessToken is not being applied
	console.log("logging user out");
	try {
		if (watchObject[req.headers.room]) {
			watchObject[req.headers.room] = null;
		}
		res.status(200).send("Logged Out");
	} catch (e) {
		console.log("Error with performing logout request", e);
		res.status(500).send("An error occurred while attempting to logout");
	}
	//const accessToken = req.headers.authorization.split(" ")[1];
});

router.get("/testingURL", (req, res) => {
	let accessToken = req.cookies.accessToken;
	let refreshToken = req.cookies.refreshToken;
	console.log("pls work: ", accessToken);
	console.log("pls work2: ", refreshToken);
	res.send(JSON.stringify(accessToken));
});

var watchObject = {};

router.get("/loadWatchList", verifyToken, verifyWatchObject, (req, res) => {
	console.log("I am now in loadWatchList---------------------------");
	console.log("current accessToken in loadWatchList: ", req.cookies.accessToken);

	console.log("loading current watchObjectList: ", watchObject[roomData]);
	let tempRoom = req.headers.room;
	if (watchObject[data.room] == null || watchObject[data.room] == undefined) {
		console.log("init watchObject in skipVideo");
		watchObject[data.room] = { videoList: [], videoCount: 0, timestamp: Date.now() };
	}

	if (tempRoom in watchObject) {
		console.log("this is what im sending back: ", watchObject[tempRoom]);
		res.send(watchObject[tempRoom]); //send back as 23: {videoList:[tyler1,speedy],1}
	} else {
		res.send(); //return nothing?
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
			//I dont think this is called
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

			if (watchObject[data.room] == null || watchObject[data.room] == undefined) {
				console.log("init watchObject in searchVideo");
				watchObject[data.room] = { videoList: [], videoCount: 0, timestamp: Date.now() };
			}

			if (req.session.roomData[data.room] == null) {
				//req.session.roomData[data.room] = []; //change to 23 : {watchList: [tyler1,speedy], videoCount: 0}
				req.session.roomData[data.room] = { videoList: [], videoCount: 0, timestamp: Date.now() };
			}

			console.log("searchVideo: ", data.videoId);
			console.log("my data: ", data);
			//play video(video id) event to room
			socket.to(data.room).emit("user-searched", data);
		});
		socket.on("skipVideo", (data) => {
			console.log("my-roomSkippy: ", data);
			if (watchObject[data.room] == null || watchObject[data.room] == undefined) {
				console.log("init watchObject in skipVideo");
				watchObject[data.room] = { videoList: [], videoCount: 0, timestamp: Date.now() };
			}

			watchObject[data.room].videoCount = data.videoCount;
			socket.to(data.room).emit("user-skipped", data);
		});
	});

	return router;
};

module.exports = returnRouter;
