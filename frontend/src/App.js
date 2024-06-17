/*global google*/
import "./App.css";
import HomePage from "./portfolio/HomePage";
import Projects from "./portfolio/Projects";
import TodoLogin from "./todo/TodoLogin";
import NotFound from "./NotFound";
import Navbar from "./Navbar";

import TodoHomepage from "./todo/TodoHomepage";
import PrivateRoutes from "./utils/PrivateRoutes";
import YouTubePrivateRoutes from "./utils/YouTubePrivateRoutes";
import TaskEdit from "./todo/TaskEdit";
import AddTask from "./todo/AddTask";
import TodoRegister from "./todo/TodoRegister";

import WatchRoom from "./youtubeApp/WatchRoom";
import Login from "./youtubeApp/Login";
import YouTubeHomePage from "./youtubeApp/Homepage";
import PrivacyPolicy from "./youtubeApp/PrivacyPolicy";
import io from "socket.io-client";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);
function App() {
	return (
		<div className="App">
			<Router basename="/">
				<Routes>
					<Route path="/" element={<HomePage />}></Route>
					<Route exact path="/Projects" element={<Projects />}></Route>
					<Route exact path="/Project/To-do-login" element={<TodoLogin />}></Route>
					<Route exact path="/Project/To-do-register" element={<TodoRegister />}></Route>

					<Route exact path="/Project/YoutubeApp/Login/*" element={<Login />}></Route>
					<Route exact path="/Project/YoutubeApp/Privacy" element={<PrivacyPolicy />}></Route>
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
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
