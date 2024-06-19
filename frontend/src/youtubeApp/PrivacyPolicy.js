import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
	return (
		<div className="privacy-policy">
			<header>
				<h1>Privacy Policy</h1>
			</header>
			<main>
				<section>
					<h2>Introduction</h2>
					<p>
						Welcome to my WatchLounge application. This Privacy Policy explains how I collect, use,
						disclose, and protect your information when you use my Google OAuth2 app. I am committed
						to protecting your privacy and ensuring a positive experience on this application.
					</p>

					<p>
						<strong>
							First and foremost this is a resume/portfolio project for fun. Not intended to be
							leveraged in a production setting.
						</strong>
					</p>
				</section>
				<section>
					<h2>Information I Collect</h2>
					<p>I may collect the following types of information:</p>
					<ul>
						<li>
							<strong>Personal Information:</strong> When you use my app to sign in with Google, I
							collect your Google account information, including your email address and profile
							information.
						</li>
					</ul>
				</section>
				<section>
					<h2>How I Use Your Information</h2>
					<p>I use the information I collect for the following purposes:</p>
					<ul>
						<li>
							<strong>To Search for videos using your data:</strong> I use your information to use
							the YouTube API to search for the queries you generate and want to view on my website.
						</li>
					</ul>
				</section>
				<section>
					<h2>Information Sharing and Disclosure</h2>
					<p>I do not share or disclose your personal information.</p>
				</section>
				<section>
					<h2>Data Security</h2>
					<p>
						I implement industry-standard security measures to protect your information from
						unauthorized access, use, or disclosure. However, no data transmission over the internet
						or electronic storage is completely secure. I cannot guarantee absolute security.
					</p>
				</section>
				<section>
					<h2>Data Retention</h2>
					<p>
						Your information is only retained for the duration of the tokens provided via
						authentication. After expiration of said tokens, you will need to sign in again and
						re-provide your information/consent.
					</p>
				</section>

				<section>
					<h2>Changes to This Privacy Policy</h2>
					<p>
						I may update this Privacy Policy from time to time. I will notify you of any significant
						changes by posting the new Privacy Policy on my app and updating the effective date.
						Your continued use of my app after any changes indicates your acceptance of the updated
						Privacy Policy.
					</p>
				</section>
				<section>
					<h2>Limited Use Requirements</h2>
					<p>
						This application's use and transfer to any other app of information received from Google
						APIs will adhere to Google API Services User Data Policy, including the Limited Use
						requirements.
					</p>
					<p>
						You may find more details on their requirements here:
						<a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"></a>
					</p>
				</section>
				<section>
					<h2>Contact Me</h2>
					<p>
						If you have any questions or concerns about this Privacy Policy or my privacy practices,
						please contact me at:
					</p>
					<p>ethangordon25@gmail.com</p>
				</section>
			</main>
		</div>
	);
};

export default PrivacyPolicy;
