import { Button, TextField } from "@mui/material";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Checkbox from "@mui/material/Checkbox";
import DateTimePicker from "react-datetime-picker";

import Navbar from "../Navbar";

export default function AddTask() {
	let navigate = useNavigate();
	let [userID, setUser] = useState(() =>
		localStorage.getItem("authTokens")
			? jwt_decode(localStorage.getItem("authTokens"))["user_id"]
			: null
	);

	const [taskDetails, setTaskDetails] = useState({
		task_name: "",
		task_info: "",
		task_due: new Date(),
		isCompleted: false,
		taskOwner: userID,
	});

	function handleLogout() {
		setUser(null);
		localStorage.removeItem("authTokens");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		navigate("/Project/To-do-Login");
	}

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		setTaskDetails((prevState) => ({ ...prevState, [name]: value }));
		console.log(taskDetails);
	};

	async function handleSubmit(e) {
		e.preventDefault();
		let response = await fetch("http://127.0.0.1:8000/api/createTask/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify(taskDetails),
		});
		if (response.ok) {
			console.log("everything is good");
			alert("Task Successfully Added!");
			navigate("/Project/To-do/Dashboard");
		} else {
			console.log("Something went wrong");
			console.log("error");
		}
	}
	async function tokenRefresher() {
		if (!localStorage.getItem("accessToken")) {
			//if no accessToken
			navigate("/Project/To-do-Login");
		} else if (jwt_decode(localStorage.getItem("accessToken"))["exp"] * 1000 <= Date.now()) {
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
			console.log("accessToken Expired->making new access token w/ refresh token");
			console.log(data);
		} else if (jwt_decode(localStorage.getItem("refreshToken"))["exp"] * 1000 <= Date.now()) {
			//if refreshToken has expired
			handleLogout();
		}
	}

	useEffect(() => {
		tokenRefresher();
	});

	return (
		<div>
			<Navbar />
			<h2>This is my register page</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Task Name:
					<input
						type="text"
						name="task_name"
						value={taskDetails.task_name}
						onChange={onChangeHandler}
						required
					/>
				</label>
				<label>
					Task Info:
					<input
						type="text"
						name="task_info"
						value={taskDetails.task_info}
						onChange={onChangeHandler}
					/>
				</label>
				<Checkbox
					checked={taskDetails.isCompleted}
					onClick={(event) => {
						setTaskDetails({ ...taskDetails, isCompleted: event.target.checked });
					}}
				/>
				<DateTimePicker
					onChange={(date) => setTaskDetails({ ...taskDetails, ["task_due"]: date })}
					value={taskDetails.task_due}
				/>
				<input type="submit" value="AddTask" />
			</form>
		</div>
	);
}
