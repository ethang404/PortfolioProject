/*global google*/
import "./App.css";
import HomePage from "./portfolio/HomePage";
import Projects from "./portfolio/Projects";
import TodoLogin from "./todo/TodoLogin";

import TodoHomepage from "./todo/TodoHomepage";
import PrivateRoutes from "./utils/PrivateRoutes";
import YouTubePrivateRoutes from "./utils/YouTubePrivateRoutes";
import TaskEdit from "./todo/TaskEdit";
import AddTask from "./todo/AddTask";
import TodoRegister from "./todo/TodoRegister";

import WatchRoom from "./youtubeApp/WatchRoom";
import Login from "./youtubeApp/Login";
import YouTubeHomePage from "./youtubeApp/Homepage";
import io from "socket.io-client";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const socket = io.connect("http://localhost:8080");
function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />}></Route>
					<Route exact path="/Project/To-do-login" element={<TodoLogin />}></Route>
					<Route exact path="/Project/To-do-register" element={<TodoRegister />}></Route>

					<Route exact path="/Project/YoutubeApp/Login/*" element={<Login />}></Route>
					<Route exact path="/Project/YoutubeApp/Login/*" element={<Login />}></Route>

					<Route element={<YouTubePrivateRoutes />}>
						<Route
							exact
							path="/Project/YoutubeApp/Home"
							element={<YouTubeHomePage socket={socket} />}
						></Route>
						<Route
							exact
							path="/Project/YoutubeApp/Watch/:room"
							element={<WatchRoom socket={socket} />}
						></Route>
					</Route>

					<Route element={<PrivateRoutes />}>
						<Route path="/Project/To-do/Dashboard" element={<TodoHomepage />}></Route>
						<Route path="/Project/To-do/Task/:id" element={<TaskEdit />}></Route>
						<Route path="/Project/To-do/AddTask/" element={<AddTask />}></Route>
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
