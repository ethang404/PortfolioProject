const express = require("express"); //import express
const app = express(); //express server
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = 8080;

const cors = require("cors"); //install cors

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const loginroute = require("./routes/auth"); //import routing from routes/login
const youtubeRoutes = require("./routes/youtube")(io);

//const youtubeRoute = require("./routes/youtube"); //import routing from youtube

app.use(cors());

// Handling routes request for login functions(including JWT tokens)
app.get("/", (req, res) => {
	res.send("test home page");
});

app.use("/auth", loginroute);
app.use("/yt", youtubeRoutes);

server.listen(PORT, function (err) {
	//will this work?
	if (err) console.log("Error in server setup");
	console.log("Server listening on Port", PORT);
});
