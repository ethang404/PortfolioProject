import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Checkbox from "@mui/material/Checkbox";
import DateTimePicker from "react-datetime-picker";

import "./TaskEdit.css";

export default function TaskEdit() {
	const { id } = useParams();
	//Send to this component a object form homepage->The task you clicked on VIA props. To get old data...Should fix required field issue?
	//Also weird task_due and isCompleted errors with types?
	let navigate = useNavigate();
	let [userID, setUser] = useState(() =>
		localStorage.getItem("authTokens")
			? jwt_decode(localStorage.getItem("authTokens"))["user_id"]
			: null
	);

	const [taskDetails, setTaskDetails] = useState({
		id: parseInt(id),
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
		} else if (jwt_decode(localStorage.getItem("refreshToken"))["exp"] * 1000 <= Date.now()) {
			//if refreshToken has expired
			handleLogout();
		}
	}

	useEffect(() => {
		console.log(typeof taskDetails.id, taskDetails.id);
		console.log(typeof taskDetails.task_name, taskDetails.task_name);
		console.log(typeof taskDetails.task_info, taskDetails.task_info);
		console.log(typeof taskDetails.task_due, taskDetails.task_due);
		console.log(typeof taskDetails.isCompleted, taskDetails.isCompleted);
		console.log(typeof taskDetails.taskOwner, taskDetails.taskOwner);
		tokenRefresher();
	});

	async function handleSubmit(e) {
		//Make Fetch Request here
		e.preventDefault();
		let response = await fetch(`${process.env.REACT_APP_TODO_URL}/api/updateTask/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + JSON.parse(localStorage.getItem("accessToken")),
			},
			body: JSON.stringify(taskDetails),
		});
		if (response.ok) {
			console.log("everything is good");
			alert("Task Successfully Updated!");
			navigate("/Project/To-do/Dashboard");
		} else {
			console.log("Something went wrong");
			console.log("error");
		}
	}

	return (
		<div className="task-edit-page">
			<h1>Edit Task</h1>
			<div className="task-edit-form-container">
				<form onSubmit={handleSubmit} className="task-edit-form">
					<label className="task-edit-form-label">
						Task Name:
						<input
							type="text"
							name="task_name"
							value={taskDetails.task_name}
							onChange={onChangeHandler}
							required
							className="task-edit-form-input"
						/>
					</label>
					<label className="task-edit-form-label">
						Task Info:
						<input
							type="text"
							name="task_info"
							value={taskDetails.task_info}
							onChange={onChangeHandler}
							className="task-edit-form-input"
						/>
					</label>
					<Checkbox
						checked={taskDetails.isCompleted}
						onClick={(event) => {
							setTaskDetails({ ...taskDetails, isCompleted: event.target.checked });
						}}
						className="task-edit-form-checkbox"
					/>
					<DateTimePicker
						onChange={(date) => setTaskDetails({ ...taskDetails, ["task_due"]: date })}
						value={taskDetails.task_due}
						className="task-edit-form-datetimepicker"
					/>
					<input type="submit" value="Save" className="task-edit-form-submit" />
				</form>
				<div className="task-details-preview">
					<h4>Task Details:</h4>
					<pre className="task-details-preview-json">{JSON.stringify(taskDetails, null, 2)}</pre>
				</div>
			</div>
		</div>
	);
}
