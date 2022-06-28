import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Projects from "./Projects";
import "./Homepage.css";
import Ethan_Gordon_Resume from "./images_downloads/Ethan_Gordon_Resume.pdf";
import Picture_of_me from "./images_downloads/Picture_of_me.jpg";
import Navbar from "../Navbar";

export default function HomePage() {
	return (
		<div className="main">
			<Navbar/>
			<div className = "About">
				<div className="About-Me">
					<h2>Some information about me</h2>
					<p>Hello there! I'm a Senior at Texas Tech University.
					I will be graduating in May 2023 with a bachelors in Computer Science and a minor in Math. I built this website with the intent
					of adding more personal projects as I go along and to practice my <span>frontend(react/css)</span> and <span>backend(django/node)</span> skills.<br></br> I love all 
					things Computer Science and am pursuing fullstack or backend development(css is a struggle for me). Thanks for checking out my website!
					</p>
					<h3>
						<a target="_blank" href={Ethan_Gordon_Resume}>
							Click here for my Resume!
						</a>
					</h3>
				</div>
				<div className="About-pic">
					<img src={Picture_of_me} alt="Pic" className = "Pic"></img>
				</div>
			</div>
			<div className="Skills">
				<h2 className="Skills-title">These is some of my skills!</h2>
				<div className = "Skills-list">
					<div className="skill1">Skill 1
						--add an image here.
					</div>
					<div className="skill2">Skill 2
						--add an image here.
					</div>
					<div className="skill3">Skill 3
						--add an image here.
					</div>
					<div className="skill4">Skill 4
						--add an image here.
					</div>
				</div>
			</div>
			<div className="Projects">
				<div className="Projects-inner">
					<div className="Project1"><h3>ToDo Project</h3><br></br>
						<p>Simple todo list application with login page. Push daily tasks each day to I-message or email?</p>
						<a href="/Project/To-do">Check it out!</a>
					</div>
					<div className="Project2"><h3>Project2</h3><br></br>
						<p>Will become a youtube room player. The user generates a room or joins one with other users. Use youtube API 
							to play a video to watch a youtube video together with others. 
						</p>
						<button className="Project-button">Check it out!</button>
					</div>
				</div>

			</div>
		</div>
	);
}
