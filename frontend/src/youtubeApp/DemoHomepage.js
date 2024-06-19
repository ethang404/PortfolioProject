import "./DemoHomepage.css";

const HomePage = () => {
	return (
		<div className="homepage">
			<header className="header">
				<h1 className="title">Watch Lounge App</h1>
			</header>
			<section className="description">
				<p>
					Welcome to the WatchLounge App. This app allows you to search and play YouTube videos
					seamlessly along with your friends!
				</p>
				<br></br>
				<p>
					Simply login with your google account, grant permissions, and join a room with a friend.
				</p>
			</section>
			<section className="tech-stack">
				<h2>Tech Stack Used</h2>
				<ul>
					<li>React</li>
					<li>CSS</li>
					<li>---------------</li>
					<li>Express</li>
					<li>Passport (for OAUTH2)</li>
					<li>YouTube Data API</li>
					<li>AWS Deployment & CI/CD with github + Netlify</li>
				</ul>
			</section>
			<section className="demo-video">
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/vrlG_QCBEC4?mute=1&controls=1"
					frameborder="0"
					allowfullscreen
				></iframe>
			</section>

			<footer className="footer">
				<a className="login-link" href="/Project/YoutubeApp/Login/">
					Click here to try the app
				</a>

				<a className="privacy-link" href="/Project/YoutubeApp/Privacy">
					See Privacy Policy
				</a>
			</footer>
		</div>
	);
};

export default HomePage;
