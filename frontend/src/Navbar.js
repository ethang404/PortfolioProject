import "./Navbar.css";

export default function Navbar(){
    return(
        <div>
            <nav className="Nav">
					<ul className="Nav-elements">
						<li>
							<a href="/">Home</a>
						</li>
						<li>
							<a href="/Projects">Projects</a>
						</li>
					</ul>
				</nav>
        </div>

    );
}