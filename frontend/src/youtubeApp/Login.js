import { useParams, useNavigate, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import google_logo from "./images/google_logo.png";

import "./Login.css";

export default function Login() {
	const navigate = useNavigate();
	const [user, setUser] = useState({});

	useEffect(() => {
		const fetchVerifyToken = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/yt/verifyToken`, {
					method: "GET",
					credentials: "include", // Include cookies
				});

				if (response.status === 200) {
					// Redirect to the specified route
					console.log("user verified-all good: redirecting");
					navigate("/Project/YoutubeApp/Home", { replace: true });
				} else {
					console.log("user not verified-relogin");
					// Do nothing
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchVerifyToken();
	}, []);

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
