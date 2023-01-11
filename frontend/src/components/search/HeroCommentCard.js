import React, { useContext } from 'react';
import UserContext from '../../private/auth/UserContext';

function HeroCommentsCard({
	comment_id,
	user_id,
	comment,
	created_date,
	created_time,
	username,
	superhero_name,
	superhero_id,
}) {
	const {
		currentUser,
		heroCommentLikedIds,
		likeComment,
		unlikeComment,
	} = useContext(UserContext);

	// like/unlike a comment
	async function handleLikeComment(evt) {
		console.log('superhero_id: ', superhero_id);
		console.log('comment_id: ', comment_id);
		// likeComment is a method within App.js
		likeComment(comment_id, superhero_id);
	}
	async function handleUnlikeComment(evt) {
		// unlikeComment is a method within App.js
		unlikeComment(comment_id, superhero_id);
	}

	let heroAllUsersCommentLikedCount = !currentUser
		.heroAllUsersCommentLikedIds[comment_id]
		? 0
		: currentUser.heroAllUsersCommentLikedIds[comment_id];

	console.log('heroCommentLikedIds: ', heroCommentLikedIds);

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
				{heroCommentLikedIds.has(+comment_id) && (
					<a
						title={`Unlike This Comment for ${superhero_name}`}
						onClick={handleUnlikeComment}
					>
						<img src="/img/unlike-icon.png" alt="Unlike" />
					</a>
				)}
				{!heroCommentLikedIds.has(+comment_id) && (
					<a
						title={`Like This Comment for ${superhero_name}`}
						onClick={handleLikeComment}
					>
						<img src="/img/like-icon.png" alt="Like" />
					</a>
				)}
				<span
					className="activity-counter"
					title={`${heroAllUsersCommentLikedCount} Like(s) on This Comment for ${superhero_name}`}
				>
					{heroAllUsersCommentLikedCount}
				</span>
			</div>
		</div>
	);
}

export default HeroCommentsCard;
