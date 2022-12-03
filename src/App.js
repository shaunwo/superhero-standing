import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import Navigation from './paths/Navigation';
import Paths from './paths/Routes';
import './App.css';

import UserContext from './private/auth/UserContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import BackendApi from './private/api/backend-api';
import SuperheroApi from './private/api/superhero-api';
import jwt from 'jsonwebtoken';

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = 'ss-token';

function App() {
	const [infoLoaded, setInfoLoaded] = useState(false);
	const [heroFollowIds, setHeroFollowIds] = useState(new Set([]));
	const [currentUser, setCurrentUser] = useState(null);
	const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

	console.debug(
		'App',
		'infoLoaded=',
		infoLoaded,
		'currentUser=',
		currentUser,
		'token=',
		token
	);

	// Load user info from API. Until a user is logged in and they have a token,
	// this should not run. It only needs to re-run when a user logs out, so
	// the value of the token is a dependency for this effect.
	useEffect(
		function loadUserInfo() {
			console.debug('App useEffect loadUserInfo', 'token=', token);

			async function getCurrentUser() {
				if (token) {
					try {
						let { username } = jwt.decode(token);
						// put the token on the Api class so it can use it to call the API.
						BackendApi.token = token;
						let currentUser = await BackendApi.getCurrentUser(
							username
						);
						setCurrentUser(currentUser);
					} catch (err) {
						console.error(
							'App loadUserInfo: problem loading',
							err
						);
						setCurrentUser(null);
						setHeroFollowIds(null);
					}
				}
				setInfoLoaded(true);
			}

			// set infoLoaded to false while async getCurrentUser runs; once the
			// data is fetched (or even if an error happens!), this will be set back
			// to false to control the spinner.
			setInfoLoaded(false);
			getCurrentUser();
		},
		[token]
	);

	// handles logout from anywhere on the site
	function logout() {
		setCurrentUser(null);
		setToken(null);
	}

	// handles login from anywhere on the site
	async function login(loginData) {
		try {
			let token = await BackendApi.login(loginData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			return { success: false, errors };
		}
	}

	// handles signup from anywhere on the site
	async function signup(signupData) {
		try {
			let token = await BackendApi.signup(signupData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			return { success: false, errors };
		}
	}

	// checks to see if a hero has been followed, yet
	function hasFollowedHero(id) {
		return heroFollowIds.has(id);
	}

	// follow a hero - API call, and update set of FollowHeroIds
	async function followHero(id) {
		if (hasFollowedHero(id)) return;
		console.log('Inside async function followHero(id) on App.js');
		let follow_id = await BackendApi.followHero(currentUser.user_id, id);
		setHeroFollowIds(new Set([...heroFollowIds, follow_id]));
	}

	// displaying the spinner on the screen if no other data has been loaded, yet
	if (!infoLoaded) return <LoadingSpinner />;

	return (
		<BrowserRouter>
			<UserContext.Provider
				value={{
					currentUser,
					setCurrentUser,
					hasFollowedHero,
					followHero,
				}}
			>
				<div className="App" id="wrapper">
					<Navigation logout={logout} />
					<Paths signup={signup} login={login} />
				</div>
				<div id="footer">&copy; 2022 by Shaun Worcester</div>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
