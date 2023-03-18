import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function Homepage() {//pass in user data(including refresh token from Login)
	const [accessToken,setToken] = useState("")

	async function searchYoutube(){
		console.log("search for youtube Id's here to display with react youtube npm")
		//also need to implement join room feature on this component
	}


	useEffect(() => {
		var temp = localStorage.getItem('accessToken')
		setToken(temp)
		console.log("Homepage access Token: ",accessToken)//this may or may not render in time..doesnt matter
	}, []);

	return (
		<div>
			{accessToken}
			This is my Home page
			<h4>Either enter a code to join or start your own room to wathc a video</h4>
		</div>
	);
}
