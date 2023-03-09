import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function Homepage() {
	const { code } = useParams();

	useEffect(() => {
		var url = window.location;

		var code = new URLSearchParams(url.search).get("code");
		console.log(code);
	}, []);

	return (
		<div>
			This is my Home page
			<h4>Either enter a code to join or start your own room to wathc a video</h4>
		</div>
	);
}
