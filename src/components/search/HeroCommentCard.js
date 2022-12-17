import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';

function CommentsCard({ user_id, comment, created_dt, username }) {
	// displaying the search card on the screen
	return (
		<div className="card">
			<div className="card-body">
				<p>{comment}</p>
				<em>
					by{' '}
					<a
						href={`/profile/${user_id}`}
						title={`View Profile for ${username}`}
					>
						{username}
					</a>{' '}
					on {created_dt}
				</em>
			</div>
		</div>
	);
}

export default CommentsCard;
