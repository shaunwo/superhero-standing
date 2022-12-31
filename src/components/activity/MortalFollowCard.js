import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';
import './ActivityCard.css';

// unfollow a mortal
/* async function handleUnfollowMortal(evt) {
	// unfollowMortal is a method on App.js
	unfollowMortal(id);
} */

function MortalFollowCard({
	user_id,
	username,
	firstName,
	lastName,
	location,
	heroFollowIds,
	heroLikeIds,
}) {
	const { unfollowMortal } = useContext(UserContext);

	function handleUnfollowMortal(evt) {
		evt.preventDefault();
		// unfollowMortal is a method within App.js
		unfollowMortal(user_id);
	}

	// displaying the search card on the screen
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
				<button
					className="btn btn-sm btn-primary"
					onClick={handleUnfollowMortal}
					title={`Cancel Follow Request`}
				>
					Unfollow
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

export default MortalFollowCard;
