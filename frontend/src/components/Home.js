import React from 'react';
import './Home.css';

function Home() {
	return (
		<div id="home">
			<img
				src="/img/home-page-collage.png"
				alt="Superheroes Collage"
			/>
			<h1>Home</h1>
			<p>
				Superhero Standing allows you to search for, rate, and leave
				comments on your favorite superheroes. You can upload your
				own images, interact with other fans, and have some fun!
			</p>
			<p>
				You can execute a search, look through the leaderboard, and
				click around in other areas of the site to find your
				favorite heroes OR fellow fans. This site is built on
				community engagement, and we need you!
			</p>
			<p>
				<a href="/login" title="Login to Superhero Standing">
					Login
				</a>{' '}
				or{' '}
				<a href="/signup" title="Sign Up for Superhero Standing">
					Sign Up
				</a>{' '}
				to get started, today.
			</p>
			<p>Above all... have fun!</p>
		</div>
	);
}

export default Home;
