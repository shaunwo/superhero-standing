import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';

function MortalFollowerCard({
	user_id,
	username,
	firstName,
	lastName,
	location,
	heroFollowIds,
	heroLikeIds,
	approveBtn,
}) {
	// defining methods from UserContext
	const { approveMortalFollower, rejectMortalFollower } = useContext(
		UserContext
	);

	function handleApproveMortalFollower(evt) {
		evt.preventDefault();
		console.log('handleApproveMortalFollower: ' + user_id);
		// unfollowMortal is a method within App.js
		approveMortalFollower(user_id);
	}
	function handleRejectMortalFollower(evt) {
		evt.preventDefault();
		console.log('handleRejectMortalFollower: ' + user_id);
		// unfollowMortal is a method within App.js
		rejectMortalFollower(user_id);
	}

	// displaying the follower on the screen
	return (
		<div className="card">
			<div className="card-body">
				<h3>{username}</h3>
				<div>
					{`${firstName} ${lastName}`}
					<br />
					Location: {location}
					<br />
					<strong>{heroFollowIds.length}</strong> Hero Follows
					<br />
					<strong>{heroLikeIds.length}</strong> Hero Likes
					<br />
				</div>
			</div>
			<div className="card-footer">
				{approveBtn === true && (
					<button
						className="btn btn-sm btn-success"
						onClick={handleApproveMortalFollower}
						title={`Approve Follower Request`}
					>
						Approve
					</button>
				)}
				<button
					className="btn btn-sm btn-primary"
					onClick={handleRejectMortalFollower}
					title={`Cancel Follower Request`}
				>
					Reject
				</button>
				<a
					href={`/profile/${user_id}`}
					title={`View Profile for ${user_id}`}
				>
					More Details
				</a>
			</div>
		</div>
	);
}

export default MortalFollowerCard;
