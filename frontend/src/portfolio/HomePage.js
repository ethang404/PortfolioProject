import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Projects from "./Projects";
import "./Homepage.css";
import Ethan_Gordon_Resume from "./images_downloads/Ethan_Gordon_Resume.pdf";
import Picture_of_me from "./images_downloads/Picture_of_me.jpg";
import GitHub_Mark from "./images_downloads/GitHub_Mark.jpg";
import linked_in from "./images_downloads/linked_in.jpg";
import mail from "./images_downloads/mail.jpg";

import Frontend_Mark from "./images_downloads/Frontend_Mark.jpg";
import Backend_Mark from "./images_downloads/Backend_Mark.jpg";
import Teamwork from "./images_downloads/Teamwork.jpg";
import coming_soon from "./images_downloads/coming_soon.jpg";

import Navbar from "../Navbar";

/*
<a target="_blank" href={Ethan_Gordon_Resume}>
							Click here for my Resume!
						</a>

*/

export default function HomePage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const mailtoLink = `mailto:ethangordon25@gmail.com?subject=${name}&body=${message}`;
		window.location.href = mailtoLink;

		setName("");
		setEmail("");
		setMessage("");
	};

	return (
		<div className="main">
			<div className="introduction">
				<div className="introduction-text">
					<h2 className="main-header">Hi, I'm Ethan Gordon</h2>
					<h4 className="second-header">Software Engineer</h4>
					<div className="container">
						<div className="logo">
							<a href="https://github.com/ethang404">
								<img src={GitHub_Mark} alt="Github Logo" />
							</a>
						</div>
						<div className="logo">
							<a href="https://www.linkedin.com/in/ethan-gordon-2b564923b">
								<img src={linked_in} alt="LinkedIn Logo" />
							</a>
						</div>
						<div className="logo">
							<a href="mailto:ethangordon25@gmail.com">
								<img src={mail} alt="Mail Logo" />
							</a>
						</div>
					</div>
					<a
						className="my-resume"
						href={Ethan_Gordon_Resume}
						target="_blank"
						rel="noopener noreferrer"
					>
						Resume
					</a>
				</div>
			</div>
			<section className="about-me">
				<img src={Picture_of_me} alt="Pic" className="Pic"></img>
				<div className="about-me-info">
					<h4>About Me</h4>

					<p>
						I particularly enjoy backend and database design, where I find joy in creating solutions
						that blend functionality and efficiency.
					</p>

					<p>
						Eager to broaden my skill set, I've ventured into frontend development, ensuring a
						well-rounded expertise in crafting end-to-end solutions. My commitment to versatility is
						mirrored in the full-stack nature of many of my personal projects.
					</p>

					<p>
						Outside the lines of code, you'll find me fueled by a genuine passion for learning. I'm
						on a perpetual quest to absorb new knowledge and skills, always seeking to push the
						boundaries of what I can achieve. Whether it's a project that enhances my own life or
						contributes to the well-being of others, I believe in the power of software engineering
						to bring about meaningful change. Join me on this exciting journey of innovation and
						growth. Let's build something extraordinary together!
					</p>

					<h4>Check my projects out below!</h4>
				</div>
			</section>
			<section className="projects-background">
				<section className="projects-container">
					<div className="project">
						<h4>Todo List Application</h4>
						<p>This was my first ever fully independent</p>
						<p></p>
						<a href="/Project/To-do-login">Click here to see</a>
					</div>
					<div className="project">
						<h4>Youtube WatchRoom Project</h4>
						<p>
							This youtube watchroom project allows you to join a room with multiple friends and
							watch youtube videos at the same time. This is accomplished via websockets
							specifically Socket.IO. I've deployed the frontend to Netlify(React.js) and the
							backend(Node.js) to AWS EC2 instance.
						</p>
						<a href="/Project/YoutubeApp/Login/">Click here to see</a>
					</div>
				</section>
			</section>
			<section className="skills-container">
				<ul>
					<li>
						<h4>Frontend</h4>
						<img src={Frontend_Mark} alt="Frontend Image" />
					</li>
					<li>
						<h4>Backend</h4>
						<img src={Backend_Mark} alt="Backend Image" />
					</li>
					<li>
						<h4>Git Version Control</h4>
						<img src={GitHub_Mark} alt="Git Version Control Image" />
					</li>
					<li>
						<h4>Teamwork</h4>
						<img src={Teamwork} alt="Teamwork Image" />
					</li>
				</ul>
			</section>

			<section className="contact-form">
				<form onSubmit={handleSubmit}>
					<label htmlFor="name">Name:</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<label htmlFor="message">Message:</label>
					<textarea
						id="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					></textarea>
					<button type="submit">Submit</button>
				</form>
			</section>
		</div>
	);
}
