import { Outlet, useNavigate, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
	const navigate = useNavigate();
	//const accessToken = jwt_decode(localStorage.getItem("accessToken"));
	//console.log("This is my private route: ", accessToken);
	//const auth = { token: accessToken };

	const [isLoggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	async function validateToken() {
		let resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/yt/verifyToken`, {
			method: "GET",
			credentials: "include", // Include HttpOnly cookies
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (resp.ok) {
			console.log("user is valid!");
			setLoading(false);
			setLoggedIn(true);
		} else {
			console.log("invalid user", resp);
			setLoading(false);
			navigate(`/Project/YoutubeApp/Login`, { replace: true });
		}
	}

	useEffect(() => {
		validateToken();
	}, []);

	//return isLoggedIn ? <Outlet /> : null;
	if (loading) {
		return <div>Loading...</div>; // Show a loading state while validating token
	}

	return isLoggedIn ? <Outlet /> : <Navigate to="/Project/YoutubeApp/Login" />;
}
