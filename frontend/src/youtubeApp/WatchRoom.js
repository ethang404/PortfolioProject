/*global google*/
import "./WatchRoom.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//const socket = io.connect("http://localhost:8080");
//var socket = io.connect();

export default function WatchRoom({ socket }) {
	const navigate = useNavigate();
	const { room } = useParams();
	const playerRef = useRef();
	const [videoSearch, setVideoSearch] = useState("");
	const [searchResponse, setSearchResponse] = useState([]);
	const [fullSearchResponse, setFullSearchResponse] = useState([]);
	const [videoCount, setVideoCount] = useState(0);
	//think I need a different setup to store elements of videos
	const [currentTime, setCurrentTime] = useState(0.0);
	const [showNotification, setShowNotification] = useState(false);

	useEffect(() => {
		//this is for if user joins late
		console.log("on first render..here is my env variable: ", process.env.REACT_APP_BACKEND_URL);
		console.log("First room join");
		socket.emit("join_room", room);
		loadWatchList();
	}, []);

	useEffect(() => {
		playerRef.current.internalPlayer.seekTo(currentTime); //this is crazy bugged for some reason
	}, [currentTime]);

	useEffect(() => {
		console.log(fullSearchResponse);
		//fullSearchResponse.map((video) => console.log(video.thumbnail));
	}, [fullSearchResponse]);

	useEffect(() => {
		console.log("Updated Search Response: ");
		console.log(searchResponse);
	}, [searchResponse]);

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
		let temp = data;
		let temp2 = data.videoCount;
		let temp3 = data.videosDetails;
		console.log(temp);
		console.log(temp2);
		console.log(temp3);
		//setSearchResponse(temp3);

		const ids = data.videosDetails.map((video) => video.videoId);
		setSearchResponse(ids);

		setFullSearchResponse(temp3);
		//setSearchResponse((oldArray) => [...oldArray, ...data.videosDetails]);
		//setSearchResponse(data.videoList); //also attach a videoCount variable so i know what index I'm on(video1 vs video2 in queue) for late join users/refreshes
		//setVideoCount(...data.videoCount);
		setVideoCount(data.videoCount);

		//I should also set the timestamp here to update new user's time
	}

	async function getTime(otherTime) {
		if (playerRef.current) {
			let myTime = await playerRef.current.internalPlayer.getCurrentTime();
			console.log("Within getTime funcion: ", myTime, "Other user's time: ", otherTime);
			if (Math.abs(myTime - otherTime) > 2.0) {
				//if time difference greater than 2 seconds update time to be the later time.
				setCurrentTime(otherTime);
			}
			return myTime;
		}
	}

	const handleNewUserJoin = () => toast("New User Connected!");

	useEffect(() => {
		//socket.emit("join_room", room); //join a room..have to call again to work at refresh..?

		socket.on("user-played", (data) => {
			console.log("other user clicked play..(room): " + room);
			console.log(playerRef);
			console.log(playerRef.current);
			//console.log(playerRef.current.internalPlayer);

			if (playerRef.current) playerRef.current.internalPlayer.playVideo();
		});
		socket.on("update-time", (data) => {
			console.log("dataInfo: " + data);
			let time = getTime(data);

			//set to larger time(max of incoming and currentTime)
			//if within 3 sec.
		});

		socket.on("user-paused", (data) => {
			console.log("other user clicked pause: ");
			if (playerRef.current) playerRef.current.internalPlayer.pauseVideo(); //This is enough to fix it!?
		});
		socket.on("user-searched", (data) => {
			console.log("other user searching video: ");
			console.log(data);
			console.log(data.videoId);
			//playerRef.current.internalPlayer.pauseVideo();
			//setSearchResponse((oldArray) => [...oldArray, ...data.videosDetails]);
			setSearchResponse((oldArray) => [...oldArray, data.videoId]);
			const tempObject = {
				thumbnail: data.thumbnail,
				videoId: data.videoId,
				title: data.title,
			};
			setFullSearchResponse((oldArray) => [...oldArray, tempObject]);
		});
		socket.on("user-skipped", (data) => {
			console.log("other user skipping video: ");
			console.log(data);
			//playerRef.current.internalPlayer.pauseVideo();
			setVideoCount(data.videoCount);
			//setVideoCount(data.videoCount++);
		});

		socket.on("new-user", (data) => {
			console.log("New user joined");
			handleNewUserJoin();
		});
	}, [socket]);

	async function logout() {
		try {
			let resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/yt/logout`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (resp.ok) {
				console.log("Logging user out");
				navigate("/Project/YoutubeApp/Login/");
			} else {
				console.log("HTTP Error:", resp.status);
			}
		} catch (err) {
			console.log("Fetch Error:", err);
		}
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

				//instead I can load array of video items here and onClick of one it will add it to setSearchResponse
				//data.map((videoItem) => setSearchResponseList(videoItem.id.videoId));

				//console.log("thumbnail: ", response.data.items[0].snippet.thumbnails);
				//console.log("title: ", response.data.items[0].snippet.title)

				const tempObject = {
					thumbnail: data[0].snippet.thumbnails["default"].url,
					videoId: data[0].id.videoId,
					title: data[0].snippet.title,
				};

				console.log(tempObject);

				setFullSearchResponse((oldArray) => [...oldArray, tempObject]);
				console.log(fullSearchResponse);

				//setSearchResponse((oldArray) => [...oldArray, tempObject]);
				setSearchResponse((oldArray) => [...oldArray, data[0].id.videoId]);
				console.log("Data after search: ", data);
				console.log("VideoThumbnail after search: ", data[0].snippet.thumbnails["default"]);
				socket.emit("searchVideo", {
					videoId: data[0].id.videoId,
					thumbnail: data[0].snippet.thumbnails["default"].url,
					title: data[0].snippet.title,
					room: room,
				});
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

	const handlePrev = () => {
		setVideoCount((prevIndex) => (prevIndex === 0 ? fullSearchResponse.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setVideoCount((prevIndex) => (prevIndex === fullSearchResponse.length - 1 ? 0 : prevIndex + 1));
	};

	return (
		<div className="Parent">
			<ToastContainer />
			<h3>You can search for a video in the box below! Give it a go!</h3>
			<form className="userInput">
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

			<div className="horizontal-list-container">
				<button onClick={handlePrev}>&lt;</button>
				<div className="horizontal-list">
					{fullSearchResponse.map((item, index) => (
						<div key={index} className={index === videoCount ? "list-item active" : "list-item"}>
							<h2>{item.title}</h2>
							<img src={item.thumbnail} alt={item.title} />
						</div>
					))}
				</div>
				<button onClick={handleNext}>&gt;</button>
			</div>

			<h3>Room Code is: {room}</h3>
			<h3>Current videoCount is: {JSON.stringify(videoCount)}</h3>

			<button
				className="CustomButton"
				onClick={() => {
					setVideoCount(videoCount + 1);
					socket.emit("skipVideo", { videoCount: videoCount + 1, room: room });
				}}
			>
				Skip
			</button>

			<div className="YoutubePlayer">
				<YouTube
					ref={playerRef}
					//videoId={searchResponse.length > 0 ? null : searchResponse[videoCount]}
					videoId={searchResponse == undefined ? null : searchResponse[videoCount]}
					// defaults -> ''
					//id={string} // defaults -> ''
					//className={string} // defaults -> ''
					//iframeClassName={string} // defaults -> ''
					//style={object} // defaults -> {}
					//title={string} // defaults -> ''
					//loading={string} // defaults -> undefined
					//opts={obj} // defaults -> {}
					onReady={(event) => {
						console.log(playerRef);
						console.log(playerRef.current);
						console.log(playerRef.current.internalPlayer);
						//console.log("I have joined room");
						//socket.emit("join_room", room);
					}}
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
						//else: update current time = recieved time from event. (always updates to the one clicked)
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
			<button className="logoutButton" onClick={logout}>
				Logout
			</button>
		</div>
	);
}
