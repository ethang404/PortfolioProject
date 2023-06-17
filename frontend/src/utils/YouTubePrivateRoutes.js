import { Outlet, useNavigate, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
	const navigate = useNavigate();
	//const accessToken = jwt_decode(localStorage.getItem("accessToken"));
	//console.log("This is my private route: ", accessToken);
	//const auth = { token: accessToken };
	/*
	const [isLoggedIn, setLoggedIn] = useState(false);

	async function validateToken() {
		let resp = await fetch("http://localhost:8080/auth/validToken", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("accessToken"),
			},
		});
		if (resp.ok) {
			console.log("user is valid!");
			setLoggedIn(true);
		}
	}

	useEffect(() => {
		let accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			validateToken();
		} else {
			navigate("/Project/YoutubeApp/Login");
		}
	});*/
	//return isLoggedIn ? <Outlet /> : null;
	return true ? <Outlet /> : <Navigate to="/Project/YoutubeApp/Login" />;
}
