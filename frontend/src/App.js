import "./App.css";
import HomePage from "./portfolio/HomePage";
import Projects from "./portfolio/Projects";
import TodoLogin from "./todo/TodoLogin";
import TodoReg from "./todo/TodoReg";
import TodoHomepage from "./todo/TodoHomepage";
import PrivateRoutes from './utils/PrivateRoutes';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />}></Route>
					<Route exact path="/Project/To-do-login" element={<TodoLogin />}></Route>
					<Route exact path="/Project/To-do-register" element={<TodoReg />}></Route>

					<Route element={<PrivateRoutes />}> 
						<Route path="/Project/To-do/Dashboard" element={<TodoHomepage />}></Route>
					</Route>

					
				</Routes>
			</Router>
		</div>
	);
}

export default App;
