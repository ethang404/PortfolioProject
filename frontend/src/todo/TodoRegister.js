import { Button } from "@mui/material";
export default function TodoRegister() {
	async function tempFunc() {
		let response = await fetch(`${process.env.REACT_APP_TODO_URL}/api/token/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: 2,
				username: "sheila",
				password: "steg",
				first_name: "Sheila",
				last_name: "Stegman",
				email: "SexyBooty69@gmail.com",
			}),
		});
		let data = await response.json();
		console.log(data);
	}

	return (
		<div>
			<Button onClick={tempFunc}>Hi</Button>
		</div>
	);
}
