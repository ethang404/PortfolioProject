/*global google*/
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

//const socket = io.connect("http://localhost:8080");
//var socket = io.connect();

export default function WatchRoom({ socket }) {
	const playerRef = useRef();
	const [videoSearch, setVideoSearch] = useState("");
	const [searchResponse, setSearchResponse] = useState([]);

	useEffect(() => {
		socket.emit("join_room", 123); //join a room
		socket.on("user-played", (data) => {
			console.log("other user clicked play: ");
			playerRef.current.internalPlayer.playVideo();
		});
		socket.on("user-paused", (data) => {
			console.log("other user clicked pause: ");
			playerRef.current.internalPlayer.pauseVideo();
		});
		socket.on("search - videoId", (data) => {
			console.log("other user searching video: ");
			//playerRef.current.internalPlayer.pauseVideo();
		});
	}, [socket]);
	function refreshToken() {
		//call when accessToken expired..if refresh token expired-log out
	}
	async function searchYoutube() {
		console.log("search for youtube Id's here to display with react youtube npm");
		//join room
		//also need to implement join room feature on this component
	}

	function sendMessage() {
		socket.emit();
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
			<div className="Socket">
				Input Message Here:
				<input className="message"></input>
				<button Onclick={sendMessage}>Click to send</button>
			</div>
			<div>
				<YouTube
					ref={playerRef}
					videoId={"di0MtYgeJNE"} // defaults -> ''
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
						socket.emit("playVideo", { room: 123 });
					}} // defaults -> noop
					onPause={(event) => {
						console.log("now pausing", event);
						socket.emit("pauseVideo", { room: 123 });
					}} // defaults -> noop
					//onEnd={func} // defaults -> noop
					//onError={func} // defaults -> noop

					//THIS IS WHAT I WANT
					onStateChange={(event) => {
						console.log("now changing state", event);
					}} // defaults -> noop
					//onPlaybackRateChange={func} // defaults -> noop
					//onPlaybackQualityChange={func} // defaults -> noop
				/>
			</div>
			This is my Watch room where I embed youtube vid
			<div>
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/di0MtYgeJNE" //can change end of this url to be another vid
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/GHEgeul6MyY" //can change end of this url to be another vid
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>
		</div>
	);
}
