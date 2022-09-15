import "./App.css";
import HomePage from "./portfolio/HomePage";
import Projects from "./portfolio/Projects";
import TodoLogin from "./todo/TodoLogin";

import TodoHomepage from "./todo/TodoHomepage";
import PrivateRoutes from "./utils/PrivateRoutes";
import TaskEdit from "./todo/TaskEdit";
import AddTask from "./todo/AddTask";
import TodoRegister from "./todo/TodoRegister";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />}></Route>
					<Route
						exact
						path="/Project/To-do-login"
						element={<TodoLogin />}
					></Route>
					<Route
						exact
						path="/Project/To-do-register"
						element={<TodoRegister />}
					></Route>

					<Route element={<PrivateRoutes />}>
						<Route
							path="/Project/To-do/Dashboard"
							element={<TodoHomepage />}
						></Route>
						<Route
							path="/Project/To-do/Task/:id"
							element={<TaskEdit />}
						></Route>
						<Route path="/Project/To-do/AddTask/" element={<AddTask />}></Route>
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
