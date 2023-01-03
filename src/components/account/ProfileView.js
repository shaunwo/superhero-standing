import React, { useContext, useState, useEffect } from 'react';
import BackendApi from '../../private/api/backend-api';
import { useParams } from 'react-router-dom';
import UserContext from '../../private/auth/UserContext';
import './ProfileView.css';

function ProfileView() {
	let { id } = useParams();

	const {
		currentUser,
		mortalFollowIds,
		pendingMortalFollowIds,
		followMortal,
		unfollowMortal,
	} = useContext(UserContext);

	if (!id) id = currentUser.user_id;

	const [otherUser, setOtherUser] = useState(null);
	const [recentActivity, setRecentActivity] = useState();

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

	// pulling recent activity for the user
	useEffect(
		function getRecentActivity() {
			async function getRecentActivity() {
				try {
					let recentActivityRes = await BackendApi.getRecentActivity(
						id
					);
					let recentActivity = recentActivityRes;
					console.log('recentActivity: ', recentActivity);
					setRecentActivity(recentActivity);
				} catch (err) {
					console.error(
						'App getRecentActivityAPI: problem loading',
						err
					);
				}
			}
			getRecentActivity();
		},
		[id]
	);

	// follow/unfollow a hero
	function handleFollowMortal(evt) {
		evt.preventDefault();
		// followMortal is a method on App.js
		followMortal(id);
	}
	function handleUnfollowMortal(evt) {
		evt.preventDefault();
		// followMortal is a method on App.js
		unfollowMortal(id);
	}
	//console.log('recentActivity: ', recentActivity);
	console.log('mortalFollowIds: ', mortalFollowIds);
	console.log('pendingMortalFollowIds: ', pendingMortalFollowIds);
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
							&nbsp; | &nbsp;
							<a href={`/profile/followers`}>
								Manage Followers
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
					<h3>Stats on Superhero Standing</h3>
					<ul>
						<li>
							Superhero Follows:
							{otherUser['heroFollowIds'].length}
						</li>
						<li>Mere Mortal Follows: TBD</li>
						<li>
							Superhero Likes:
							{otherUser['heroLikeIds'].length}
						</li>
						<li>Superhero Comments: TBD</li>
					</ul>
					<h3>Recent Activity</h3>
					{recentActivity && recentActivity.length ? (
						<div className="RecentActivity">
							{recentActivity.map((a) => (
								<div>
									{otherUser['username'] !==
									currentUser.username
										? a.username
										: `YOU`}{' '}
									{a.description}{' '}
									<a
										href={`/search/${a.superhero_id}`}
										title={`More details on ${a.superhero_name}`}
									>
										{a.superhero_name}
									</a>{' '}
									on {a.created_date} at{' '}
									{a.created_time}
								</div>
							))}
						</div>
					) : (
						<p>
							No recent actity on the site, yet. Why not DO
							SOMETHING today?
						</p>
					)}
					{otherUser['username'] !== currentUser.username && (
						<>
							{!mortalFollowIds.includes(+id) &&
								!pendingMortalFollowIds.includes(
									+id
								) && (
									<form
										className="form-inline"
										onSubmit={handleFollowMortal}
									>
										<button
											type="submit"
											className="btn btn-md btn-primary"
											onSubmit={
												handleFollowMortal
											}
										>
											Follow
										</button>
									</form>
								)}
							{(mortalFollowIds.includes(+id) ||
								pendingMortalFollowIds.includes(
									+id
								)) && (
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
