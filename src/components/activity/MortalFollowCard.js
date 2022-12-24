import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';
import './ActivityCard.css';

// unfollow a mortal
/* async function handleUnfollowMortal(evt) {
	// unfollowMortal is a method on App.js
	unfollowMortal(id);
} */

function MortalFollowCard({ user_id }) {
	const { unfollowMortal } = useContext(UserContext);
	const [followedMortal, setFollowedMortal] = useState();

	function handleUnfollowMortal(evt) {
		evt.preventDefault();
		// unfollowMortal is a method within App.js
		unfollowMortal(user_id);
	}

	// displaying the search card on the screen
	return (
		<div className="card">
			<div className="card-body">
				{user_id}
				<div>
					<a
						href={`/profile/${user_id}`}
						title={`View Profile for ${user_id}`}
					>
						More Details
					</a>
				</div>
			</div>
			<div className="card-footer">
				<button
					className="btn btn-sm btn-primary"
					onClick={handleUnfollowMortal}
					title={`Cancel Follow Request`}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default MortalFollowCard;
