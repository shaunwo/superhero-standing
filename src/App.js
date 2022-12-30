import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import Navigation from './paths/Navigation';
//import { Flasher } from 'react-universal-flash';
//import Message from './components/common/Message';
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
	const [mortalFollowIds, setMortalFollowIds] = useState();
	const [pendingMortalFollowIds, setPendingMortalFollowIds] = useState();
	const [mortalFollowerIds, setMortalFollowerIds] = useState();
	const [pendingMortalFollowerIds, setPendingMortalFollowerIds] = useState();
	const [heroLikeIds, setHeroLikeIds] = useState(new Set([]));
	const [heroAllUsersFollowIds, setHeroAllUsersFollowIds] = useState(
		new Object({})
	);
	const [heroAllUsersLikeIds, setHeroAllUsersLikeIds] = useState(
		new Object({})
	);
	const [heroAllUsersCommentsIds, setHeroAllUsersCommentsIds] = useState(
		new Object({})
	);
	const [heroAllUsersUploadsIds, setHeroAllUsersUploadsIds] = useState(
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
							new Set(currentUser.heroFollowIds)
						);
						setHeroLikeIds(new Set(currentUser.heroLikeIds));
						setHeroAllUsersFollowIds(
							new Object(currentUser.heroAllUsersFollowIds)
						);
						setHeroAllUsersLikeIds(
							new Object(currentUser.heroAllUsersLikeIds)
						);
						setHeroAllUsersCommentsIds(
							new Object(
								currentUser.heroAllUsersCommentsIds
							)
						);
						setHeroAllUsersUploadsIds(
							new Object(
								currentUser.heroAllUsersUploadsIds
							)
						);
						setMortalFollowIds(currentUser.mortalFollowIds);
						setPendingMortalFollowIds(
							currentUser.pendingMortalFollowIds
						);
						setMortalFollowerIds(
							currentUser.mortalFollowerIds
						);
						setPendingMortalFollowerIds(
							currentUser.pendingMortalFollowerIds
						);
					} catch (err) {
						console.error(
							'App loadUserInfo: problem loading',
							err
						);
						setCurrentUser(null);
						setHeroFollowIds(null);
						setHeroLikeIds(null);
						setHeroAllUsersFollowIds(null);
						setHeroAllUsersLikeIds(null);
						setHeroAllUsersCommentsIds(null);
						setHeroAllUsersUploadsIds(null);
						setMortalFollowIds(null);
						setPendingMortalFollowIds(null);
						setMortalFollowerIds(null);
						setPendingMortalFollowerIds(null);
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
		console.log('hasFollowedHero: ' + id);
		console.log('heroFollowIds: ', heroFollowIds);
		return heroFollowIds.has(+id);
	}
	// checks to see if a hero has been liked, yet
	function hasLikedHero(id) {
		console.log('hasLikedHero: ' + id);
		console.log('heroLikeIds: ', heroLikeIds);
		return heroLikeIds.has(+id);
	}

	// follow a hero - API call, and update sets of FollowHeroIds
	async function followHero(id) {
		if (hasFollowedHero(id)) return;
		let heroResults = await SuperheroApi.getHero(id);
		let hero = heroResults.data.data;
		let superheroName = hero.name;
		await BackendApi.followHero(
			currentUser.user_id,
			currentUser.username,
			id,
			superheroName
		);
		setHeroFollowIds(new Set([...heroFollowIds, +id]));
		if (!currentUser.heroAllUsersFollowIds[id]) {
			setHeroAllUsersFollowIds(
				(currentUser.heroAllUsersFollowIds[id] = 1)
			);
		} else {
			setHeroAllUsersFollowIds(
				(currentUser.heroAllUsersFollowIds[id] =
					currentUser.heroAllUsersFollowIds[id] + 1)
			);
		}
	}
	// UNfollow a hero - API call, and update sets of FollowHeroIds
	async function unfollowHero(id) {
		if (!hasFollowedHero(id)) return;
		let heroResults = await SuperheroApi.getHero(id);
		let hero = heroResults.data.data;
		let superheroName = hero.name;
		await BackendApi.unfollowHero(
			currentUser.user_id,
			currentUser.username,
			id,
			superheroName
		);
		setHeroFollowIds((s) => {
			s.delete(+id);
			return new Set(s);
		});
		setHeroAllUsersFollowIds(
			(currentUser.heroAllUsersFollowIds[id] =
				currentUser.heroAllUsersFollowIds[id] - 1)
		);
	}

	// like a hero - API call, and update sets of LikeHeroIds
	async function likeHero(id) {
		if (hasLikedHero(id)) return;
		let heroResults = await SuperheroApi.getHero(id);
		let hero = heroResults.data.data;
		let superheroName = hero.name;
		await BackendApi.likeHero(
			currentUser.user_id,
			currentUser.username,
			id,
			superheroName
		);
		setHeroLikeIds(new Set([...heroLikeIds, +id]));
		if (!currentUser.heroAllUsersLikeIds[id]) {
			setHeroAllUsersLikeIds(
				(currentUser.heroAllUsersLikeIds[id] = 1)
			);
		} else {
			setHeroAllUsersLikeIds(
				(currentUser.heroAllUsersLikeIds[id] =
					currentUser.heroAllUsersLikeIds[id] + 1)
			);
		}
	}
	// UNlike a hero - API call, and update set of LikeHeroIds
	async function unlikeHero(id) {
		if (!hasLikedHero(id)) return;
		let heroResults = await SuperheroApi.getHero(id);
		let hero = heroResults.data.data;
		let superheroName = hero.name;
		await BackendApi.unlikeHero(
			currentUser.user_id,
			currentUser.username,
			id,
			superheroName
		);
		setHeroLikeIds((s) => {
			s.delete(+id);
			return new Set(s);
		});
		setHeroAllUsersLikeIds(
			(currentUser.heroAllUsersLikeIds[id] =
				currentUser.heroAllUsersLikeIds[id] - 1)
		);
	}

	// comment on a hero - API call, and update set of heroAllUsersCommentsIds
	async function commentOnHero(commentData, id) {
		let heroResults = await SuperheroApi.getHero(id);
		let hero = heroResults.data.data;
		let superheroName = hero.name;
		await BackendApi.commentOnHero(
			currentUser.user_id,
			currentUser.username,
			id,
			superheroName,
			commentData
		);
		if (!currentUser.heroAllUsersCommentsIds[id]) {
			setHeroAllUsersCommentsIds(
				(currentUser.heroAllUsersCommentsIds[id] = 1)
			);
		} else {
			setHeroAllUsersCommentsIds(
				(currentUser.heroAllUsersCommentsIds[id] =
					currentUser.heroAllUsersCommentsIds[id] + 1)
			);
		}
	}
	// upload an image for a hero - API call, and update set of heroAllUsersCommentsIds
	async function uploadHeroImage(uploadFormData, id) {
		let heroResults = await SuperheroApi.getHero(id);
		let hero = heroResults.data.data;
		let superheroName = hero.name;
		console.log('uploadFormData: ', uploadFormData);
		await BackendApi.uploadHeroImage(
			currentUser.user_id,
			currentUser.username,
			id,
			superheroName,
			uploadFormData
		);
		/*if (!currentUser.heroAllUsersUploadsIds[id]) {
			setHeroAllUsersUploadsIds(
				(currentUser.heroAllUsersUploadsIds[id] = 1)
			);
		} else {
			setHeroAllUsersUploadsIds(
				(currentUser.heroAllUsersUploadsIds[id] =
					currentUser.heroAllUsersUploadsIds[id] + 1)
			);
		}*/
	}

	// follow a mortal - API call, and update array of pendingMortalFollowIds
	function followMortal(id) {
		BackendApi.followMortal(currentUser.user_id, id);
		setPendingMortalFollowIds([...pendingMortalFollowIds, +id]);
	}
	// unfollow a mortal - API call, and update array of FollowMortalIds
	function unfollowMortal(id) {
		BackendApi.unfollowMortal(currentUser.user_id, id);
		/*console.log(
			'pendingMortalFollowIds on App.js BEFORE: ',
			pendingMortalFollowIds
		);
		console.log('pendingMortalFollowIds id on App.js: ' + id);*/
		if (mortalFollowIds && mortalFollowIds.includes(+id)) {
			const idx = mortalFollowIds.indexOf(+id);
			//setMortalFollowIds(mortalFollowIds.splice(+idx, 1));
			setMortalFollowIds((s) => {
				s.splice(idx, 1);
				return [...s];
			});
		} else if (
			pendingMortalFollowIds &&
			pendingMortalFollowIds.includes(+id)
		) {
			const idx = pendingMortalFollowIds.indexOf(+id);
			//console.log('pendingMortalFollowIds idx on App.js: ' + idx);
			//setMortalFollowIds(pendingMortalFollowIds.splice(idx, 1));
			setPendingMortalFollowIds((s) => {
				s.splice(idx, 1);
				return [...s];
			});
		}
		/* console.log(
			'pendingMortalFollowIds on App.js AFTER: ',
			pendingMortalFollowIds
		); */
	}

	// follow a mortal - API call, and update array of pendingMortalFollowIds
	function approveMortalFollower(id) {
		BackendApi.approveMortalFollower(currentUser.user_id, id);
		setMortalFollowerIds([...mortalFollowerIds, +id]);
		const idx = pendingMortalFollowerIds.indexOf(+id);
		console.log('pendingMortalFollowerIds idx:' + idx);
		const newPendingMortalFollowerIds = pendingMortalFollowerIds.splice(
			idx,
			1
		);
		console.log(
			'newPendingMortalFollowerIds:',
			newPendingMortalFollowerIds
		);
		/*setPendingMortalFollowerIds((s) => {
			s.splice(idx, 1);
			return s;
		});*/
	}
	function rejectMortalFollower(id) {
		BackendApi.rejectMortalFollower(currentUser.user_id, id);
		if (mortalFollowerIds && mortalFollowerIds.includes(+id)) {
			const idx = mortalFollowerIds.indexOf(+id);
			setMortalFollowerIds((s) => {
				s.splice(idx, 1);
				return [...s];
			});
		} else if (
			pendingMortalFollowerIds &&
			pendingMortalFollowerIds.includes(+id)
		) {
			const idx = pendingMortalFollowerIds.indexOf(+id);
			setPendingMortalFollowerIds((s) => {
				s.splice(idx, 1);
				return [...s];
			});
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
					hasFollowedHero,
					followHero,
					unfollowHero,
					hasLikedHero,
					likeHero,
					unlikeHero,
					commentOnHero,
					uploadHeroImage,
					followMortal,
					unfollowMortal,
					heroFollowIds,
					heroLikeIds,
					heroAllUsersFollowIds,
					heroAllUsersLikeIds,
					heroAllUsersCommentsIds,
					heroAllUsersUploadsIds,
					mortalFollowIds,
					pendingMortalFollowIds,
					mortalFollowerIds,
					pendingMortalFollowerIds,
					rejectMortalFollower,
					approveMortalFollower,
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
