/* global google*/

import { useParams, useNavigate, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import google_logo from "./images/google_logo.png";

import YouTubeHomePage from "./Homepage";

import "./Login.css";

export default function Login() {
	const navigate = useNavigate();

	const [user, setUser] = useState({});
	const [token, setToken] = useState("");

	function handleLogin(response) {
		console.log("call back response", response);
		console.log("encoded JWT", response.credential);
		var access_token = response.credential;

		setToken(response.credential);
		var userObj = jwt_decode(response.credential);
		console.log(userObj);
		setUser(userObj);
		setToken(response.credential);
		var userObj = jwt_decode(response.credential);
		console.log(userObj);
		setUser(userObj);

		if (user) {
			console.log("test");
			localStorage.setItem("accessToken", JSON.stringify(response.credential));
			navigate("/Project/YoutubeApp/Home", { replace: true });
		} else {
			alert("There has been an error with Login");
		}
	}

	useEffect(() => {
		/* global google */
		/*google.accounts.id.initialize({
			client_id: process.env.REACT_APP_CLIENT_ID,
			callback: handleLogin,
		});

		google.accounts.id.renderButton(document.getElementById("SignIn"), {
			theme: "outline",
			size: "large",
		});*/
		//blooo
		const fetchVerifyToken = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/yt/verifyToken`, {
					method: "GET",
					credentials: "include", // Include cookies
				});

				if (response.status === 200) {
					// Redirect to the specified route
					console.log("all good: redirecting");
					navigate("/Project/YoutubeApp/Home", { replace: true });
				} else {
					console.log("bruh bad");
					// Do nothing
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchVerifyToken();
	}, []);

	async function googleOAuth() {
		//	<Navigate to="https://accounts.google.com/o/oauth2/auth?response_type=token&scope=https://www.googleapis.com/auth/youtube&redirect_uri=http://localhost:3000/Project/YoutubeApp/Home&client_id=97845079356-jftb8q0tkc7tkr36o9qpujpcp34a8sr5.apps.googleusercontent.com" />;
		//const { access_token } = useParams();
	}
	//<a href="https://youtubebackend.com/auth/google">Click me</a>
	return (
		<div className="main-container">
			<div id="SignIn"></div>

			<a href={process.env.REACT_APP_BACKEND_URL + "/auth/google"} class="google-button">
				<img src={google_logo} alt="Google Logo" class="google-logo" />
				<span>Sign in with Google</span>
			</a>
		</div>
	);
}
