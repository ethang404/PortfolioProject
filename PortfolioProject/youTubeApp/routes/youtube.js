const express = require("express");

// Creating express Router
const router = express.Router();

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
			//play video(video id) event to room
			socket.to(data.room).emit("search-videoId", { message, room });
		});
	});

	console.log("test(first call from youtubeRoute)");
	router.get("/youtube1", (req, res) => {
		console.log("test2");
		io.on("connection", (socket) => {
			console.log(`User Connected: ${socket.id}`);
		});
		res.send("This is the youtube HOME request");
	});

	router.post("/message", function (req, res) {
		console.log("Post request hit.");
		//listen to a 'pause' message from client->emit a pause message to client
		io.on("pause", (socket) => {
			socket.emit("userPaused");
		});

		res.send("test post request");
	});

	return router;
};

//search for youtube video
router.post("/youtube", (req, res) => {
	res.send("This is the youtube request");
});

router.get("/", (req, res) => {
	res.send("Testing youtube API");
});
router.get("/test", (req, res) => {
	res.send("Testing youtube API(test)");
});

module.exports = returnRouter;
