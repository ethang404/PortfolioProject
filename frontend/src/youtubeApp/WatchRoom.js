import io from "socket.io-client";
import { useState, useEffect } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

const socket = io.connect("http://localhost:8080");
//var socket = io.connect();

export default function WatchRoom() {
	useEffect(() => {
		socket.on("user-played", (data) => {
			console.log("other user clicked play: ");

			setMessageReceived(data.message);
		});
	}, [socket]);
	function refreshToken() {
		//call when accessToken expired..if refresh token expired-log out
	}
	function searchVideos() {} //how to access event.target.playVideo(); in useEffect

	function sendMessage() {
		socket.emit();
	}
	function emitEvent(event) {
		console.log("fuck the horse");
		console.log(event);
	}
	function changeBorderColor(playerStatus) {
		//onClick-if playerStatus=1(playing)->emit "pause"--player status 2
		//onClick-if playerStatus=2(pause)->emit "play"--player status 1
		//playerStatus States:
		//1 = playing
		//2 = paused
		//3 = buffering
	}
	function onPlayerStateChange(event) {
		console.log(event);
		if (event.data == YouTube.PlayerState.PLAYING) {
			console.log("playing now...");
		} else {
			console.log("not playinhg");
		}
	}

	function ready(event) {
		console.log("testing");
		console.log(event);
		event.target.playVideo();
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
					videoId={"di0MtYgeJNE"} // defaults -> ''
					//id={string} // defaults -> ''
					//className={string} // defaults -> ''
					//iframeClassName={string} // defaults -> ''
					//style={object} // defaults -> {}
					//title={string} // defaults -> ''
					//loading={string} // defaults -> undefined
					//opts={obj} // defaults -> {}
					//onReady={ready} // defaults -> noop
					onPlay={(event) => {
						console.log(event);
						console.log(event.target);
						console.log("now playing");
						console.log(YouTube.PlayerState);
						event.target.playVideo();
						event.target.pauseVideo();
						emitEvent(event);
					}} // defaults -> noop
					onPause={(event) => {
						console.log("now pausing", event);
						console.log(YouTube.PlayerState.BUFFERING);
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
