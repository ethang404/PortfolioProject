/*global google*/
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useNavigate, useParams } from "react-router-dom";

//const socket = io.connect("http://localhost:8080");
//var socket = io.connect();

export default function WatchRoom({ socket }) {
	const { room } = useParams();
	const playerRef = useRef();
	const [videoSearch, setVideoSearch] = useState("");
	const [searchResponse, setSearchResponse] = useState([]);
	const [videoCount, setVideoCount] = useState(0);

	const [currentTime, setCurrentTime] = useState(0.0);

	useEffect(() => {
		//this is for if user joins late
		console.log("on first render");
		loadWatchList();
	}, []);

	useEffect(() => {
		playerRef.current.internalPlayer.seekTo(currentTime); //this is crazy bugged for some reason
	}, [currentTime]);

	async function loadWatchList() {
		let response = await fetch("http://localhost:8080/yt/loadWatchList", {
			method: "GET",
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
		setSearchResponse(data); //also attach a videoCount variable so i know what index I'm on(video1 vs video2 in queue) for late join users/refreshes
		//setVideoCount(data[1]);
	}

	async function getTime(otherTime) {
		let myTime = await playerRef.current.internalPlayer.getCurrentTime();
		console.log("Within getTime funcion: ", myTime, "Other user's time: ", otherTime);
		if (Math.abs(myTime - otherTime) > 2.0) {
			//if time difference greater than 2 seconds update time to be the later time.
			setCurrentTime(otherTime);
		}
		console.log("FUCK", myTime);
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
			let resp = await fetch("http://localhost:8080/yt/searchVideo", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("accessToken"),
					q: videoSearch,
					//q: "tyler1",
					//Authorization: "Bearer " + "testyyy",
				},
			});

			if (resp.ok) {
				let data = await resp.json();
				console.log("recieved value from search result: ");
				console.log(data);
				setSearchResponse((oldArray) => [...oldArray, data[0].id.videoId]);
				//emit here to update other user if search result good:

				socket.emit("searchVideo", { videoId: data[0].id.videoId, room: room });

				//setSearchResponse(data[0].id.videoId);
				console.log(data[0].id.videoId);
				// process the data here
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
		<div>
			<button
				onClick={() => {
					console.log(socket.connected);
					socket.emit("searchVideo", { videoId: videoSearch, room: room });
				}}
			>
				emitSearch
			</button>
			<h3>You can search for a video in the box below! Give it a go!</h3>
			<form>
				<label>Search for Video:</label>
				<input
					type="text"
					required
					value={videoSearch}
					onChange={(e) => setVideoSearch(e.target.value)}
				></input>
				<button
					onClick={(event) => {
						event.preventDefault();
						searchYoutube();
					}}
				>
					Hehe clicky me to search!
				</button>
			</form>
			<button
				onClick={() => {
					setVideoCount(videoCount + 1);
					socket.emit("skipVideo", { videoCount: videoCount + 1, room: room });
				}}
			>
				Skip Ahead
			</button>
			<h3>Room Code is: {room}</h3>
			<h3>Current videoId is: {searchResponse[0]}</h3>
			<h3>Current videoCount is: {videoCount}</h3>
			<div>
				<YouTube
					ref={playerRef}
					videoId={searchResponse[videoCount]} // defaults -> ''
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
			This is my Watch room where I embed youtube vid
		</div>
	);
}
