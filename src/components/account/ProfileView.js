import React, { useContext, useState, useEffect } from 'react';
import BackendApi from '../../private/api/backend-api';
import { useParams } from 'react-router-dom';
import UserContext from '../../private/auth/UserContext';
import './ProfileView.css';

function ProfileView() {
	let { id } = useParams();

	const {
		currentUser,
		hasFollowedMortal,
		followMortal,
		unfollowMortal,
	} = useContext(UserContext);

	if (!id) id = currentUser.user_id;

	const [otherUser, setOtherUser] = useState(null);
	const [followedMortal, setFollowedMortal] = useState();
	const [unfollowedMortal, setUnfollowedMortal] = useState();

	useEffect(
		function updateFollowedMortalStatus() {
			console.log(
				'HeroCard useEffect updateFollowedMortalStatus',
				'id=',
				id
			);
			console.log('inside React.useEffect id: ' + id);
			setFollowedMortal(hasFollowedMortal(id));
			console.log(hasFollowedMortal(id));
		},
		[id, hasFollowedMortal]
	);

	// pulling the other user info from API
	useEffect(
		function getOtherUserInfo() {
			async function getOtherUserInfo() {
				try {
					let otherUserRes = await BackendApi.getOtherUser(id);
					let otherUser = otherUserRes;
					console.log('otherUser: ', otherUser);
					setOtherUser(otherUser);
				} catch (err) {
					console.error(
						'App getOtherUserInfo: problem loading',
						err
					);
				}
			}
			getOtherUserInfo();
		},
		[id]
	);

	// follow/unfollow a hero
	function handleFollowMortal(evt) {
		evt.preventDefault();
		//if (hasFollowedMortal(user_id)) return;

		// followMortal is a method within the BackendApi class
		followMortal(id);
		setFollowedMortal(true);
	}
	function handleUnfollowMortal(evt) {
		evt.preventDefault();
		//if (!hasFollowedMortal(user_id)) return;

		// followMortal is a method within the BackendApi class
		unfollowMortal(id);
		setFollowedMortal(false);
	}

	return (
		<>
			<h1>Profile View</h1>
			{otherUser ? (
				<>
					{otherUser['username'] === currentUser.username && (
						<p>
							<a href={`/profile/edit`}>
								Edit Your Profile
							</a>
						</p>
					)}
					<h2>{otherUser['username']}</h2>
					<p>
						{otherUser['firstName']} {otherUser['lastName']}
						<br />
						<a
							href={`mailto:${otherUser['email']}`}
							title={otherUser['email']}
						>
							{otherUser['email']}
						</a>
						<br />
					</p>
					<p>
						Located in: {otherUser['location']}
						<br />
						{otherUser['bio']}
					</p>
					<h3>Activity on Superhero Standing</h3>
					<ul>
						<li>
							Superhero Follows:
							{otherUser['heroFollowedIds'].length}
						</li>
						<li>Mere Mortal Follows: TBD</li>
						<li>
							Superhero Likes:
							{otherUser['heroLikedIds'].length}
						</li>
						<li>Superhero Comments: TBD</li>
					</ul>
					{otherUser['username'] !== currentUser.username && (
						<>
							{!followedMortal && (
								<form
									className="form-inline"
									onSubmit={handleFollowMortal}
								>
									<button
										type="submit"
										className="btn btn-md btn-primary"
										onSubmit={handleFollowMortal}
									>
										Follow
									</button>
								</form>
							)}
							{followedMortal && (
								<form
									className="form-inline"
									onSubmit={handleUnfollowMortal}
								>
									<button
										type="submit"
										className="btn btn-md btn-danger"
										onSubmit={
											handleUnfollowMortal
										}
									>
										Unfollow
									</button>
								</form>
							)}
						</>
					)}
				</>
			) : (
				<p>Sorry... that is not a valid user.</p>
			)}
		</>
	);
}

export default ProfileView;
