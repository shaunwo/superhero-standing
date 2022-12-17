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
	const [mortalFollowIds, setMortalFollowIds] = useState(new Set([]));
	const [heroLikeIds, setHeroLikeIds] = useState(new Set([]));
	const [heroAllUsersFollowedIds, setHeroAllUsersFollowedIds] = useState(
		new Object({})
	);
	const [heroAllUsersLikedIds, setHeroAllUsersLikedIds] = useState(
		new Object({})
	);
	const [heroAllUsersCommentsIds, setHeroAllUsersCommentsIds] = useState(
		new Object({})
	);
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
						setHeroFollowIds(
							new Set(currentUser.heroFollowedIds)
						);
						setHeroLikeIds(new Set(currentUser.heroLikedIds));
						setHeroAllUsersFollowedIds(
							new Object(
								currentUser.heroAllUsersFollowedIds
							)
						);
						setHeroAllUsersLikedIds(
							new Object(currentUser.heroAllUsersLikedIds)
						);
						setHeroAllUsersCommentsIds(
							new Object(
								currentUser.heroAllUsersCommentsIds
							)
						);
						setMortalFollowIds(
							new Set(currentUser.mortalFollowedIds)
						);
					} catch (err) {
						console.error(
							'App loadUserInfo: problem loading',
							err
						);
						setCurrentUser(null);
						setHeroFollowIds(null);
						setHeroLikeIds(null);
						setHeroAllUsersFollowedIds(null);
						setHeroAllUsersLikedIds(null);
						setHeroAllUsersCommentsIds(null);
						setMortalFollowIds(null);
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
		console.log('hasFollowedHero' + id);
		console.log('heroFollowIds: ', heroFollowIds);
		return heroFollowIds.has(+id);
	}
	// checks to see if a hero has been liked, yet
	function hasLikedHero(id) {
		console.log('hasLikedHero' + id);
		console.log('heroLikeIds: ', heroLikeIds);
		return heroLikeIds.has(+id);
	}

	// follow a hero - API call, and update set of FollowHeroIds
	function followHero(id) {
		if (hasFollowedHero(id)) return;
		console.log('Inside function followHero(id) on App.js');
		BackendApi.followHero(currentUser.user_id, id);
		setHeroFollowIds(new Set([...heroFollowIds, +id]));
		console.log('heroAllUsersFollowedIds[id] - id value ONLY: ' + +id);
		console.log(
			'heroAllUsersFollowedIds: ',
			currentUser.heroAllUsersFollowedIds
		);
		console.log(
			'heroAllUsersFollowedIds[id]: ',
			currentUser.heroAllUsersFollowedIds[id]
		);
		setHeroAllUsersFollowedIds(
			(currentUser.heroAllUsersFollowedIds[id] =
				currentUser.heroAllUsersFollowedIds[id] + 1)
		);
	}
	// UNfollow a hero - API call, and update set of FollowHeroIds
	function unfollowHero(id) {
		if (!hasFollowedHero(id)) return;
		console.log('Inside function unfollowHero(id) on App.js');
		BackendApi.unfollowHero(currentUser.user_id, id);
		setHeroFollowIds(new Set([heroFollowIds.delete(id)]));
		setHeroAllUsersFollowedIds(
			(currentUser.heroAllUsersFollowedIds[id] =
				currentUser.heroAllUsersFollowedIds[id] - 1)
		);
	}

	// like a hero - API call, and update set of LikeHeroIds
	function likeHero(id) {
		if (hasLikedHero(id)) return;
		console.log('Inside function likeHero(id) on App.js');
		BackendApi.likeHero(currentUser.user_id, id);
		setHeroLikeIds(new Set([...heroLikeIds, +id]));
		setHeroAllUsersLikedIds(
			(currentUser.heroAllUsersLikedIds[id] =
				currentUser.heroAllUsersLikedIds[id] + 1)
		);
	}
	// UNlike a hero - API call, and update set of LikeHeroIds
	function unlikeHero(id) {
		if (!hasLikedHero(id)) return;
		console.log('Inside function unlikeHero(id) on App.js');
		BackendApi.unlikeHero(currentUser.user_id, id);
		setHeroLikeIds(new Set([heroLikeIds.delete(id)]));
		setHeroAllUsersLikedIds(
			(currentUser.heroAllUsersLikedIds[id] =
				currentUser.heroAllUsersLikedIds[id] - 1)
		);
	}

	// comment on a hero - API call, and update set of LikeHeroIds
	function commentOnHero(commentData, id) {
		console.log('commentData: ', commentData);
		const { comments } = commentData;
		console.log('comments: ', comments);
		console.log('Inside function commentOnHero(id) on App.js');
		BackendApi.commentOnHero(currentUser.user_id, id, commentData);
		setHeroAllUsersCommentsIds(
			(currentUser.heroAllUsersCommentsIds[id] =
				currentUser.heroAllUsersCommentsIds[id] + 1)
		);
	}

	// follow a mortal - API call, and update set of FollowMortalIds
	function followMortal(id) {
		//if (hasFollowedHero(id)) return;
		console.log('Inside function followMortal(id) on App.js');
		BackendApi.followMortal(currentUser.user_id, id);
		setMortalFollowIds(new Set([...mortalFollowIds, +id]));
	}
	// unfollow a mortal - API call, and update set of FollowMortalIds
	function unfollowMortal(id) {
		//if (!hasFollowedHero(id)) return;
		console.log('Inside function unfollowMortal(id) on App.js');
		BackendApi.unfollowMortal(currentUser.user_id, id);
		setMortalFollowIds(new Set([mortalFollowIds.delete(id)]));
	}
	// checks to see if a hero has been followed, yet
	function hasFollowedMortal(id) {
		console.log('hasFollowedMortal' + id);
		console.log('mortalFollowIds: ', mortalFollowIds);
		return mortalFollowIds.has(+id);
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
					unfollowHero,
					hasLikedHero,
					likeHero,
					unlikeHero,
					commentOnHero,
					hasFollowedMortal,
					followMortal,
					unfollowMortal,
					heroAllUsersFollowedIds,
					heroAllUsersLikedIds,
					heroAllUsersCommentsIds,
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
