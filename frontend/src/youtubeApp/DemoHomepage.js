import "./DemoHomepage.css";

const HomePage = () => {
	return (
		<div className="homepage">
			<header className="header">
				<h1 className="title">Youtube Player App</h1>
			</header>
			<section className="description">
				<p>
					Welcome to the Youtube Player App. This app allows you to play and manage your favorite
					YouTube videos seamlessly.
				</p>
			</section>
			<section className="tech-stack">
				<h2>Tech Stack Used</h2>
				<ul>
					<li>React</li>
					<li>React Router</li>
					<li>CSS</li>
					<li>YouTube API</li>
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
				<a href="/Project/YoutubeApp/Login/">Click here to see</a>
			</footer>
		</div>
	);
};

export default HomePage;
