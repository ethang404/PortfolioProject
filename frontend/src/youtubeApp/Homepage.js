import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

import "./Homepage.css";

export default function Homepage({ socket }) {
	const navigate = useNavigate();
	//const [accessToken, setToken] = useState("");
	const [room, setRoom] = useState("");

	const [accessToken, setAccessToken] = useState(null);

	function handleJoinRoom() {
		// If room is not provided by user, generate a random number between 1 to 100
		if (room === "") {
			const randomRoomNumber = Math.floor(Math.random() * 100) + 1;
			//socket.emit("join_room", randomRoomNumber); //re-consider joining a room here? Maybe join room on render of next page
			navigate(`/Project/YoutubeApp/Watch/${randomRoomNumber}`);
		} else {
			//socket.emit("join_room", room);
			console.log("joining room");
			navigate(`/Project/YoutubeApp/Watch/${room}`);
		}
	}

	return (
		<div className="homepage-container">
			<h2 className="homepage-title">This is my Home page</h2>
			<p className="homepage-description">
				Either enter a code to join or start your own room to watch a video
			</p>
			<div className="homepage-form">
				<label>
					Room Code:{room}
					<input
						className="homepage-input"
						type="text"
						placeholder="Room Code"
						value={room}
						onChange={(e) => setRoom(e.target.value)}
					/>
				</label>
				<button className="homepage-button" onClick={handleJoinRoom}>
					Join Room
				</button>
			</div>
		</div>
	);
}
