import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../private/auth/UserContext';
import './Navigation.css';

function Navigation({ logout }) {
	const { currentUser } = useContext(UserContext);
	console.debug('Navigation', 'currentUser=', currentUser);

	// building the navitation options for a user that is signed in
	function loggedInNav() {
		return (
			<ul className="navbar-nav ms-auto">
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/search">
						Search
					</NavLink>
				</li>
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/followers">
						Followers
					</NavLink>
				</li>
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/leaders">
						Leaders
					</NavLink>
				</li>
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/profile">
						Profile
					</NavLink>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/" onClick={logout}>
						Log out
					</Link>
				</li>
			</ul>
		);
	}

	// building the navitation options for a user that is NOT signed in
	function loggedOutNav() {
		return (
			<ul className="navbar-nav ms-auto">
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/login">
						Login
					</NavLink>
				</li>
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/signup">
						Sign Up
					</NavLink>
				</li>
			</ul>
		);
	}

	let homeLink = '/';
	if (currentUser) homeLink = '/search';
	console.log('homeLink: ' + homeLink);
	return (
		<>
			<nav className="Navigation navbar navbar-expand-md">
				<Link className="navbar-brand" to={homeLink}>
					<img
						src="/img/superhero-standing-logo.png"
						alt="Superhero Standing"
						width="200"
					/>
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbarToggler"
					aria-controls="navbarToggler"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div
					className="collapse navbar-collapse"
					id="navbarToggler"
				>
					{currentUser ? loggedInNav() : loggedOutNav()}
				</div>
			</nav>
		</>
	);
}

export default Navigation;
