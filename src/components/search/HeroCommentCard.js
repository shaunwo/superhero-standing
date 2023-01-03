import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';

function HeroCommentsCard({
	user_id,
	comment,
	created_date,
	created_time,
	username,
	superhero_name,
}) {
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
					on {created_date} at {created_time}
				</em>
			</div>
			<div className="card-footer">
				<a title={`Unlike ${superhero_name}`}>
					<img src="/img/unlike-icon.png" alt="Unlike" />
				</a>
				<a title={`Like ${superhero_name}`}>
					<img src="/img/like-icon.png" alt="Like" />
				</a>
			</div>
		</div>
	);
}

{
	/* {hasLikedHero(id) && ( */
}
{
	/* )} */
}
{
	/* {!hasLikedHero(id) && ( */
}
{
	/* )} */
}
{
	/* 								
						onClick={handleUnlike}
onClick={handleLike}
	<span
					className="activity-counter"
					title={`${heroAllUsersCommentLikedCount} Like(s) on This Comment for ${name}`}
				>
					{heroAllUsersCommentLikedCount}
 				</span>
*/
}

export default HeroCommentsCard;
