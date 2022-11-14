import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import Navigation from './paths/Navigation';
import Paths from './paths/Routes';
import './App.css';

import UserContext from './private/auth/UserContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import BackendApi from './private/api/backend-api';
import jwt from 'jsonwebtoken';

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = 'ss-token';

function App() {
	const [infoLoaded, setInfoLoaded] = useState(false);
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
		console.log('Inside the function!');
		try {
			console.log('inside the try');
			let token = await BackendApi.login(loginData);
			setToken(token);
			console.log('token:' + token);
			console.log('currentUser:' + currentUser);
			return { success: true };
		} catch (errors) {
			console.error('login failed', errors);
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
			console.error('signup failed', errors);
			return { success: false, errors };
		}
	}

	// displaying the spinner on the screen if no other data has been loaded, yet
	if (!infoLoaded) return <LoadingSpinner />;

	return (
		<BrowserRouter>
			<UserContext.Provider
				value={{
					currentUser,
					setCurrentUser,
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
