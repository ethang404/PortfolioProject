import { useEffect } from "react";

export function CookieUtil() {
	async function getCookies() {
		try {
			const response = await fetch("http://localhost:8080/yt/testingURL", {
				method: "GET",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Request failed with status: " + response.status);
			}
			const data = await response.json();
			console.log(data);

			// Process the data or update the state with the received data
		} catch (error) {
			console.error(error);
			// Handle the error
		}
	}

	/*useEffect(() => {
		getCookies();
	}, []);*/

	//get accessToken from cookies after successful auth
	const cookiePairs = document.cookie.split("; ");

	// Step 2: Split each key-value pair into its key and value
	let cookieMap = {};
	cookiePairs.forEach((pair) => {
		const [key, value] = pair.split("=");
		cookieMap[key] = value;
	});

	// Step 3: Now, you can access the different values within the cookie
	console.log("accessToken(CookieUtil):", cookieMap["accessToken"]);
	console.log("refreshToken(CookieUtil):", cookieMap["refreshToken"]);

	return {
		accessToken: cookieMap["accessToken"],
		refreshToken: cookieMap["refreshToken"],
	};
}
