/*global google*/
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useNavigate, useParams } from "react-router-dom";

//import videoWatchList from state management file recoilStates.js
import { videoWatchList } from "../recoilStates";
import { useRecoilState } from "recoil";

//const socket = io.connect("http://localhost:8080");
//var socket = io.connect();

export default function WatchRoom({ socket }) {
	const { room } = useParams();
	const playerRef = useRef();
	const [videoSearch, setVideoSearch] = useState("");
	const [searchResponse, setSearchResponse] = useState([]);
	let [videoCount, setVideoCount] = useState(0);
	const [watchList, setWatchList] = useRecoilState(videoWatchList);

	//const setWachList = useSetRecoilState(videoWatchList);

	//PLAN:
	//When I search video, if ok: I will update my watchList with new video and then emit "searchVideo" and pass videoId like before
	//on event "user-searched" I will add videoId to watchList(Note: this event only occurs on other's client side. Not main since its socket ev)

	//on room join, I will pass current watchList value(to handle case where a user joins later)

	//on video skip I will do it like before and increment videoCount, but I will do so on the watchList now

	//when watchlist[videoCount] == len(watchList) then clear watchList
	//how to get lenth of watchList?
	//Where to do this check? -do before any operation?
	useEffect(() => {
		console.log(watchList);
	}, [watchList]);

	useEffect(() => {
		// Reads the recoil value
		//const watchList = useRecoilValue(videoWatchList);
		//socket.emit("join_room", {room:room,watchList:watchList});

		socket.emit("join_room", room); //join a room..have to call again to work at refresh..
		//I could also send the current video list here I guess?
		socket.on("user-played", (data) => {
			console.log("other user clicked play..(room): " + room);
			playerRef.current.internalPlayer.playVideo();
		});
		socket.on("user-paused", (data) => {
			console.log("other user clicked pause: ");
			playerRef.current.internalPlayer.pauseVideo();
		});
		socket.on("user-searched", (data) => {
			console.log("other user searching video: ");
			console.log(data);
			console.log(data.videoId);
			addVideo(data.videoId);
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
	function addVideo(videoId) {
		setWatchList((oldWatchList) => [
			...oldWatchList,
			{
				id: Math.floor(Math.random() * 100), //get random int 1-100
				text: videoId,
			},
		]);
		console.log("new WatchList: ", watchList);
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
				addVideo(data[0].id.videoId); //add videoId to watchList

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
					setVideoCount(videoCount++);
					socket.emit("skipVideo", { videoCount, room: room });
				}}
			>
				Skip Ahead
			</button>
			<h3>Room Code is: {room}</h3>
			<div>
				<YouTube
					ref={playerRef} //change below back to searchResponse if fails
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
						event.target.playVideo();
						socket.emit("playVideo", { room: room });
					}} // defaults -> noop
					onPause={(event) => {
						console.log("now pausing", event);
						socket.emit("pauseVideo", { room: room });
					}} // defaults -> noop
					//onEnd={func} // defaults -> noop
					//onError={func} // defaults -> noop

					//THIS IS WHAT I WANT
					onStateChange={(event) => {
						console.log("now changing state", event);
						console.log(searchResponse[videoCount]);
					}} // defaults -> noop
					//onPlaybackRateChange={func} // defaults -> noop
					//onPlaybackQualityChange={func} // defaults -> noop
				/>
			</div>
			This is my Watch room where I embed youtube vid
		</div>
	);
}
