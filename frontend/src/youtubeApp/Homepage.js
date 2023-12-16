import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { CookieUtil } from "../utils/CookieUtil";
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
			socket.emit("join_room", randomRoomNumber);
			navigate(`/Project/YoutubeApp/Watch/${randomRoomNumber}`);
		} else {
			socket.emit("join_room", room);
			console.log("joining room");
			navigate(`/Project/YoutubeApp/Watch/${room}`);
		}
	}

	async function tempFunc() {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/yt/testingURL`, {
				method: "GET",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Request failed with status: " + response.status);
			}
			const data = await response.json();
			console.log(data);

			// Process the data or update the state with the received data
		} catch (error) {
			console.error(error);
			// Handle the error
		}
		let { accessToken, refreshToken } = CookieUtil();
		console.log("accessToken(homepage2):", accessToken);
		console.log("refreshToken(homepage2):", refreshToken);
	}

	useEffect(() => {
		//let { accessToken, refreshToken } = CookieUtil();
		//console.log("accessToken(homepage):", accessToken);
		//console.log("refreshToken(homepage):", refreshToken);
		/*const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("accessToken");
		setAccessToken(token);*/
		// Step 3: Now, you can access the different values within the cookie
		/*console.log(token);
		console.log(accessToken);
		localStorage.setItem("accessToken", JSON.stringify(token));

		var temp = localStorage.getItem("accessToken");
		//setToken(temp);
		console.log("Homepage access Token: ", accessToken);*/
		//testing cookies
	}, []);

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
