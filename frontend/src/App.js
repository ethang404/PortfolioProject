import "./App.css";
import HomePage from "./portfolio/HomePage";
import Projects from "./portfolio/Projects";
import Todo from "./todo/Todo";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/Project/To-do" element={<Todo />}></Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
