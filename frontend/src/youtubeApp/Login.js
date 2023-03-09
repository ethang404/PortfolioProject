import { useNavigate, useParams, Navigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const { access_token } = useParams();
	async function googleOAuth() {
		//navigate(
		//	"https://accounts.google.com/o/oauth2/auth?response_type=token&scope=https://www.googleapis.com/auth/youtube&redirect_uri=http://localhost:3000/Project/YoutubeApp/Home&client_id=97845079356-jftb8q0tkc7tkr36o9qpujpcp34a8sr5.apps.googleusercontent.com"
		//);
		<Navigate to="https://accounts.google.com/o/oauth2/auth?response_type=token&scope=https://www.googleapis.com/auth/youtube&redirect_uri=http://localhost:3000/Project/YoutubeApp/Home&client_id=97845079356-jftb8q0tkc7tkr36o9qpujpcp34a8sr5.apps.googleusercontent.com" />;
		//const { access_token } = useParams();

		console.log(access_token);
	}

	return (
		<div>
			This is my Login page(for OAUTH)
			<a href="https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/youtube&redirect_uri=http://localhost:3000/Project/YoutubeApp/Home&client_id=97845079356-jftb8q0tkc7tkr36o9qpujpcp34a8sr5.apps.googleusercontent.com">
				Click here to do request thing
			</a>
			<button onClick={googleOAuth}>Button to navigate</button>
		</div>
	);
}
