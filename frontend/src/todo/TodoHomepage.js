import { Button } from "@mui/material";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TodoHome.css";
import Checkbox from "@mui/material/Checkbox";
import TaskEdit from "./TaskEdit";

export default function TodoHomepage() {
	let [userID, setUser] = useState(() =>
		localStorage.getItem("authTokens")
			? jwt_decode(localStorage.getItem("authTokens"))["user_id"]
			: null
	);
	let [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
	let [notes, setNotes] = useState([]);

	let navigate = useNavigate();

	const getNotes = async () => {
		let response = await fetch(`${process.env.REACT_APP_TODO_URL}/api/displayTasks/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
		});
		let data = await response.json();
		console.log(data);
		setNotes(data);
	};

	async function tokenRefresher() {
		if (!localStorage.getItem("accessToken")) {
			//if no accessToken
			navigate("/Project/To-do-Login");
		} else if (jwt_decode(localStorage.getItem("accessToken"))["exp"] * 1000 <= Date.now()) {
			//if access token expired -> refresh token.

			let response = await fetch(`${process.env.REACT_APP_TODO_URL}/api/token/refresh/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					refresh: JSON.parse(localStorage.getItem("refreshToken")),
				}),
			});
			let data = await response.json();
			localStorage.setItem("accessToken", JSON.stringify(data.access));
			console.log("accessToken Expired->making new access token w/ refresh token");
			console.log(data);
			setAccessToken(data);
			getNotes(); //refresh notes after refreshing token
		} else if (jwt_decode(localStorage.getItem("refreshToken"))["exp"] * 1000 <= Date.now()) {
			//if refreshToken has expired
			handleLogout();
		} else {
			//if Access Token is still valid(and refresh token valid)
			getNotes();
		}
	}

	async function deleteTask(e, id) {
		e.stopPropagation();
		let response = await fetch(`${process.env.REACT_APP_TODO_URL}/api/deleteTask/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify({
				id: id,
			}),
		});
		let data = await response.json();
		console.log(data);
		getNotes();
	}

	useEffect(() => {
		console.log(Date.now());
		console.log(jwt_decode(localStorage.getItem("accessToken"))["exp"] * 1000);
		tokenRefresher();
	}, [accessToken]);

	function handleLogout() {
		setUser(null);
		localStorage.removeItem("authTokens");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		navigate("/Project/To-do-Login");
	}
	async function updateComplete(e, note) {
		e.stopPropagation();
		note.isCompleted = !note.isCompleted;
		//note.id = parseInt(note.id)

		let response = await fetch(`${process.env.REACT_APP_TODO_URL}/api/updateTask/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify(note),
		});
		let data = await response.json();
		console.log(data);
		getNotes();
	}

	return (
		<div className="Parent">
			<h1 className="Title">This is my todo Homepage! Hope you enjoy!</h1>
			<div className="ButtonContainer">
				<Button className="LogoutButton" onClick={handleLogout}>
					Logout Here
				</Button>
				<Button className="AddTask" onClick={() => navigate("/Project/To-do/AddTask/")}>
					Add a Task
				</Button>
			</div>
			<div className="Notes">
				<div className="Header">
					<div className="HeaderCell">Task Name</div>
					<div className="HeaderCell">Info</div>
					<div className="HeaderCell">Time Created</div>
					<div className="HeaderCell">Time Due</div>
					<div className="HeaderCell">Is Complete</div>
					<div className="HeaderCell">Toggle Complete</div>
					<div className="HeaderCell">Delete Task</div>
				</div>
				{notes.map((note) => (
					<div
						className="Note"
						key={note.id}
						onClick={() => {
							navigate("/Project/To-do/Task/" + note.id);
						}}
					>
						<div className="Cell" data-label="Task Name">
							{note.task_name}
						</div>
						<div className="Cell" data-label="Info">
							{note.task_info}
						</div>
						<div className="Cell" data-label="Time Created">
							{note.task_created.replace("T", " | ").slice(0, 19)}
						</div>
						<div className="Cell" data-label="Time Due">
							{note.task_due.replace("T", " | ").slice(0, 19)}
						</div>
						<div className="Cell" data-label="Is Complete">
							{JSON.stringify(note.isCompleted)}
						</div>
						<div className="Cell" data-label="Toggle Complete">
							<Checkbox
								checked={note.isCompleted}
								onClick={(event) => updateComplete(event, note)}
							/>
						</div>
						<div className="Cell" data-label="Delete Task">
							<Button className="Trash" onClick={(event) => deleteTask(event, note.id)}>
								Delete Task
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
