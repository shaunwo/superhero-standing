import React from 'react';
import BackendApi from '../../private/api/backend-api';
import { useParams } from 'react-router-dom';
import UserContext from '../../private/auth/UserContext';

function ProfileView() {
	const { username } = useParams();
	async function getOtherUserInfo() {
		try {
			console.log('username: ' + username);
			let otherUser = await BackendApi.getOtherUser(username);
			console.log('otherUser: ', otherUser);
		} catch (err) {
			console.error('App getOtherUserInfo: problem loading', err);
		}
	}

	getOtherUserInfo();

	return (
		<>
			<h1>Profile View</h1>
			<p>Coming soon... </p>
		</>
	);
}

export default ProfileView;
