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
	let [accessToken, setAccessToken] = useState(
		localStorage.getItem("accessToken")
	);
	let [notes, setNotes] = useState([]);

	let navigate = useNavigate();

	const getNotes = async () => {
		let response = await fetch("http://127.0.0.1:8000/api/displayTasks/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer " + JSON.parse(localStorage.getItem("accessToken")),
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
		} else if (
			jwt_decode(localStorage.getItem("accessToken"))["exp"] * 1000 <=
			Date.now()
		) {
			//if access token expired -> refresh token.

			let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
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
			console.log(
				"accessToken Expired->making new access token w/ refresh token"
			);
			console.log(data);
			setAccessToken(data);
			getNotes();
		} else if (
			jwt_decode(localStorage.getItem("refreshToken"))["exp"] * 1000 <=
			Date.now()
		) {
			//if refreshToken has expired
			handleLogout();
		} else {
			//if Access Token is still valid(and refresh token valid)
			getNotes();
		}
	}

	async function deleteTask(e, id) {
		e.stopPropagation();
		let response = await fetch("http://127.0.0.1:8000/api/deleteTask/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer " + JSON.parse(localStorage.getItem("accessToken")),
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

		let response = await fetch("http://127.0.0.1:8000/api/updateTask/", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer " + JSON.parse(localStorage.getItem("accessToken")),
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
			<Button className="LogoutButton" onClick={handleLogout}>
				Logout Here
			</Button>
			<Button
				className="AddTask"
				onClick={() => navigate("/Project/To-do/AddTask/")}>
				Add a Task
			</Button>
			<div className="Notes">
				<table className="Table">
					<thead>
						<tr>
							<th>taskName</th>
							<th>info</th>
							<th>time created</th>
							<th>time due</th>
							<th>is Complete</th>
							<th>Toggle Complete</th>
							<th>Delete Task </th>
						</tr>
					</thead>
					<tbody>
						{notes.map((note) => (
							<tr
								key={note.id}
								onClick={() => {
									navigate("/Project/To-do/Task/" + note.id);
								}}>
								<td data-label="taskName">{note.task_name}</td>
								<td data-label="info">{note.task_info}</td>
								<td data-label="time created">
									{note.task_created.replace("T", " | ").slice(0, 19)}
								</td>
								<td data-label="time due">
									{note.task_due.replace("T", " | ").slice(0, 19)}
								</td>
								<td data-label="is Complete">
									{JSON.stringify(note.isCompleted)}
								</td>
								<td data-label="Toggle Complete">
									<Checkbox
										checked={note.isCompleted}
										onClick={(event) => updateComplete(event, note)}
									/>
								</td>
								<td data-label="Delete Task">
									<Button
										className="trash"
										onClick={(event) => deleteTask(event, note.id)}>
										Delete Task
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
