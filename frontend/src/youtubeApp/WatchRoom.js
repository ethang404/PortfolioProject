/*global google*/
import "./WatchRoom.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useNavigate, useParams } from "react-router-dom";

//const socket = io.connect("http://localhost:8080");
//var socket = io.connect();

export default function WatchRoom({ socket }) {
	const navigate = useNavigate();
	const { room } = useParams();
	const playerRef = useRef();
	const [videoSearch, setVideoSearch] = useState("");
	const [searchResponse, setSearchResponse] = useState([]);
	const [videoCount, setVideoCount] = useState(0);

	const [currentTime, setCurrentTime] = useState(0.0);

	useEffect(() => {
		//this is for if user joins late
		console.log("on first render..here is my env variable: ", process.env.REACT_APP_BACKEND_URL);
		loadWatchList();
	}, []);

	useEffect(() => {
		playerRef.current.internalPlayer.seekTo(currentTime); //this is crazy bugged for some reason
	}, [currentTime]);

	async function loadWatchList() {
		//Here add error handling where if accessToken is bad and refreshToken cannot get new one on backend
		//redirect user to login URL
		let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/yt/loadWatchList`, {
			method: "GET",
			credentials: "include", // Include HttpOnly cookies
			headers: {
				"Content-Type": "application/json",
			},
			headers: {
				room: room,
				videoCount: videoCount,
				Authorization: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		let data = await response.json();
		console.log("whoop: ", data);
		setSearchResponse(data.videoList); //also attach a videoCount variable so i know what index I'm on(video1 vs video2 in queue) for late join users/refreshes
		setVideoCount(data.videoCount);
	}

	async function getTime(otherTime) {
		let myTime = await playerRef.current.internalPlayer.getCurrentTime();
		console.log("Within getTime funcion: ", myTime, "Other user's time: ", otherTime);
		if (Math.abs(myTime - otherTime) > 2.0) {
			//if time difference greater than 2 seconds update time to be the later time.
			setCurrentTime(otherTime);
		}
		return myTime;
	}

	useEffect(() => {
		//socket.emit("join_room", {room:room,watchList:searchResponse});

		socket.emit("join_room", room); //join a room..have to call again to work at refresh..
		//I could also send the current video list here I guess?

		socket.on("user-played", (data) => {
			console.log("other user clicked play..(room): " + room);
			playerRef.current.internalPlayer.playVideo();
		});
		socket.on("update-time", (data) => {
			console.log("dataInfo: " + data);
			let time = getTime(data);
			console.log(
				"[object,promise]compared with my time... : " + time //says object promise?
			);

			//set to larger time(max of incoming and currentTime)
			//if within 3 sec.
		});

		socket.on("user-paused", (data) => {
			console.log("other user clicked pause: ");
			playerRef.current.internalPlayer.pauseVideo();
		});
		socket.on("user-searched", (data) => {
			console.log("other user searching video: ");
			console.log(data);
			console.log(data.videoId);
			//playerRef.current.internalPlayer.pauseVideo();
			setSearchResponse((oldArray) => [...oldArray, data.videoId]);
		});
		socket.on("user-skipped", (data) => {
			console.log("other user skipping video: ");
			console.log(data);
			//playerRef.current.internalPlayer.pauseVideo();
			setVideoCount(data.videoCount++);
		});
	}, [socket]);

	function refreshToken() {
		//call when accessToken expired..if refresh token expired-log out
	}

	async function searchYoutube() {
		try {
			let resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/yt/searchVideo`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					q: videoSearch,
				},
			});

			if (resp.ok) {
				let data = await resp.json();
				console.log("recieved value from search result: ");
				console.log(data);

				setSearchResponse((oldArray) => [...oldArray, data[0].id.videoId]); //here

				socket.emit("searchVideo", { videoId: data[0].id.videoId, room: room });
				/*
				//setSearchResponse((oldArray) => [...oldArray, data[0].id.videoId]); //here
				if (searchResponse && searchResponse.length > 0) {
					setSearchResponse((oldArray) => [...oldArray, data[0].id.videoId]); //here
					//emit here to update other user if search result good:
				} else {
					setSearchResponse(data[0].id.videoId);
				}
				

				//setSearchResponse(data[0].id.videoId);
				console.log(data[0].id.videoId);
				console.log("my searchResponse: ", searchResponse); //why is this undefined on first render?
				// process the data here
*/
			} else {
				console.log("HTTP Error:", resp.status);
			}
		} catch (err) {
			console.log("Fetch Error:", err);
		}
	}

	function changeBorderColor(playerStatus) {
		//onClick-if playerStatus=1(playing)->emit "pause"--player status 2
		//onClick-if playerStatus=2(pause)->emit "play"--player status 1
		//playerStatus States:
		//1 = playing
		//2 = paused
		//3 = buffering
	}

	return (
		<div className="Parent">
			<h3>You can search for a video in the box below! Give it a go!</h3>
			<form className="userInput">
				<label>Search for Video:</label>
				<input
					type="text"
					required
					value={videoSearch}
					onChange={(e) => setVideoSearch(e.target.value)}
				></input>
				<button
					className="CustomButton"
					onClick={(event) => {
						event.preventDefault();
						searchYoutube();
					}}
				>
					Search!
				</button>
			</form>

			<h3>Room Code is: {room}</h3>
			<h3>Current videoCount is: {JSON.stringify(videoCount)}</h3>
			<div className="YoutubePlayer">
				<YouTube
					ref={playerRef}
					videoId={searchResponse == undefined ? null : searchResponse[videoCount]} // defaults -> ''
					//id={string} // defaults -> ''
					//className={string} // defaults -> ''
					//iframeClassName={string} // defaults -> ''
					//style={object} // defaults -> {}
					//title={string} // defaults -> ''
					//loading={string} // defaults -> undefined
					//opts={obj} // defaults -> {}
					//onReady={(event) => {
					//console.log(event);
					//console.log(event.target);
					//console.log("now playing(by default)");
					//playerRef.current.internalPlayer.playVideo();
					//socket.emit("playVideo", { room: 123 });
					//}} // defaults -> noop
					onPlay={(event) => {
						console.log(event);
						console.log(event.target);
						console.log("now playing");
						//here im going to emit an event to get current time.
						//when other clients recive the event..compare to their own. If within 3 seconds:do nothing
						//else: update current time = recieved time from event.
						socket.emit("updateTime", { currentTime: event.target.getCurrentTime(), room: room });

						event.target.playVideo();
						socket.emit("playVideo", { room: room });
					}} // defaults -> noop
					onPause={(event) => {
						console.log("now pausing", event);

						socket.emit("pauseVideo", { room: room });
					}} // defaults -> noop
					//onEnd={func} // defaults -> noop
					//onError={func} // defaults -> noop

					onStateChange={(event) => {
						console.log("now changing state", event);
					}} // defaults -> noop
					//onPlaybackRateChange={func} // defaults -> noop
					//onPlaybackQualityChange={func} // defaults -> noop
				/>
			</div>
			<button
				className="CustomButton"
				onClick={() => {
					setVideoCount(videoCount + 1);
					socket.emit("skipVideo", { videoCount: videoCount + 1, room: room });
				}}
			>
				Skip
			</button>
		</div>
	);
}
