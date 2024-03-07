import "./Navbar.css";

export default function Navbar() {
	const frontendURL = process.env.REACT_APP_NETLIFY_URL;
	return (
		<div>
			<nav className="Nav">
				<ul className="Nav-elements">
					<li>
						<a href={process.env.REACT_APP_FRONTEND_URL}>Home</a>
					</li>
					<li>
						<a href="/Projects">Projects</a>
					</li>
				</ul>
			</nav>
		</div>
	);
}
