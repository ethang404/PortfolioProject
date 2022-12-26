var express = require("express");
var app = express();
const PORT = 8000;
const testRoute = require("./routes/testRoute");

app.listen(PORT, function (err) {
	if (err) console.log("Error in server setup");
	console.log("Server listening on Port", PORT);
});

app.use("/tests", testRoute);
