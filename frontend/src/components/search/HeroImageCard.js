import React, { useContext } from 'react';
import UserContext from '../../private/auth/UserContext';

function HeroImageCard({
	user_id,
	image_url,
	created_date,
	created_time,
	username,
	superhero_name,
	superhero_id,
}) {
	const {
		currentUser,
		heroImageLikedIds,
		likeImage,
		unlikeImage,
	} = useContext(UserContext);

	// like/unlike an image
	async function handleLikeImage(evt) {
		// likeComment is a method within App.js
		likeImage(image_url, superhero_id);
	}
	async function handleUnlikeImage(evt) {
		// unlikeComment is a method within App.js
		unlikeImage(image_url, superhero_id);
	}

	let heroAllUsersImageLikedCount = !currentUser.heroAllUsersImageLikedIds[
		image_url
	]
		? 0
		: currentUser.heroAllUsersImageLikedIds[image_url];

	console.log('heroImageLikedIds: ', heroImageLikedIds);

	// displaying the search card on the screen
	return (
		<div className="card">
			<div className="card-body">
				<p>
					<a href={image_url} target="_blank">
						<img src={image_url} />
					</a>
				</p>
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
				{heroImageLikedIds.has(image_url) && (
					<a
						title={`Unlike This Comment for ${superhero_name}`}
						onClick={handleUnlikeImage}
					>
						<img src="/img/unlike-icon.png" alt="Unlike" />
					</a>
				)}
				{!heroImageLikedIds.has(image_url) && (
					<a
						title={`Like This Comment for ${superhero_name}`}
						onClick={handleLikeImage}
					>
						<img src="/img/like-icon.png" alt="Like" />
					</a>
				)}
				<span
					className="activity-counter"
					title={`${heroAllUsersImageLikedCount} Like(s) on This Image for ${superhero_name}`}
				>
					{heroAllUsersImageLikedCount}
				</span>
			</div>
		</div>
	);
}

export default HeroImageCard;
