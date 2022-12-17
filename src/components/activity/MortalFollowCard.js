import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';

function MortalFollowCard({ user_id }) {
	// displaying the search card on the screen
	return (
		<div className="card">
			<div className="card-body">
				<p>{user_id}</p>
			</div>
		</div>
	);
}

export default MortalFollowCard;
