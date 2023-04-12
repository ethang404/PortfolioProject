/*global google*/
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";

//const socket = io.connect("http://localhost:8080");

export default function Homepage({ socket }) {
	const navigate = useNavigate();
	//pass in user data(including refresh token from Login)
	const [accessToken, setToken] = useState("");
	const [room, setRoom] = useState("");

	function handleJoinRoom() {
		socket.emit("join_room", room); //join a room
		navigate("/Project/YoutubeApp/Watch/" + room, { replace: true });
	}

	useEffect(() => {
		var temp = localStorage.getItem("accessToken");
		setToken(temp);
		console.log("Homepage access Token: ", accessToken); //this may or may not render in time..doesnt matter
	}, []);

	return (
		<div>
			{accessToken}
			<h2>This is my Home page</h2>
			<h4>Either enter a code to join or start your own room to wathc a video</h4>
			<button onClick={handleJoinRoom}>Join Room!</button>

			<label>
				Room Code:{" "}
				<input
					className="roomCode"
					type="text"
					placeholder="Room Code"
					value={room}
					onChange={(e) => setRoom(e.target.value)}
				/>
			</label>
			<button onClick={handleJoinRoom}>Join Room!</button>
			{room}
		</div>
	);
}
