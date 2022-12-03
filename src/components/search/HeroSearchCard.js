import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';
import './HeroSearchCard.css';

/** Show limited information about a superhero
 *
 * Is rendered by Search to show a "card" for each hero
 *
 * Search -> SearchCard
 */

function SearchCard({
	name,
	id,
	imageUrl,
	intelligence,
	strength,
	speed,
	durability,
	power,
	combat,
}) {
	const { hasFollowedHero, followHero } = useContext(UserContext);
	const [followed, setFollowed] = useState();
	const [unfollowed, setUnfollowed] = useState();

	React.useEffect(
		function updateFollowedStatus() {
			console.debug(
				'HeroCard useEffect updateFollowedStatus',
				'id=',
				id
			);

			setFollowed(hasFollowedHero(id));
		},
		[id, hasFollowedHero]
	);

	// follow a hero
	async function handleFollow(evt) {
		if (hasFollowedHero(id)) return;

		// followHero is a method within the SuperheroApi class
		followHero(id);
		setFollowed('true');
		setUnfollowed('false');
	}

	// displaying the search card on the screen
	return (
		<div className="card">
			<div className="card-body">
				{imageUrl && (
					<img
						src={imageUrl}
						alt={name}
						className="float-right ml-5 rounded"
					/>
				)}
				<h2 className="card-title">{name}</h2>
				<h3>Powerstats</h3>
				<ul>
					<li>Intelligence: {intelligence}</li>
					<li>Strength: {strength}</li>
					<li>Speed: {speed}</li>
					<li>Durability: {durability}</li>
					<li>Power: {power}</li>
					<li>Combat: {combat}</li>
				</ul>
				<p>
					<small>
						<a
							href={`/search/${id}`}
							title={`More details on ${name}`}
						>
							More Details
						</a>
					</small>
				</p>
			</div>
			<div className="card-footer">
				<a
					title="Follow"
					onClick={handleFollow}
					style={{ display: followed ? 'none' : 'normal' }}
				>
					<img src="/img/follow-icon.png" alt="Follow" />
				</a>
				<a
					title="Unfollow"
					style={{ display: !unfollowed ? 'none' : 'normal' }}
				>
					<img src="/img/unfollow-icon.png" alt="Unfollow" />
				</a>
				<a href="#" title="Love">
					<img src="/img/love-icon.png" alt="Love" />
				</a>
				<a href="#" title="Unlove">
					<img src="/img/unlove-icon.png" alt="Unlove" />
				</a>
				<a
					data-toggle="collapse"
					href={`#comments.${id}`}
					title="Comment"
				>
					<img src="/img/comment-icon.png" alt="Comment" />
				</a>
				<a
					data-toggle="collapse"
					href={`#upload.${id}`}
					title="Upload YOUR Image"
				>
					<img
						src="/img/upload-image-icon.png"
						alt="Upload YOUR Image"
					/>
				</a>

				<div className="collapse" id={`comments.${id}`}>
					<textarea />
				</div>
				<div className="collapse" id={`upload.${id}`}>
					<input type="file" id="myFile" name="filename" />
				</div>
			</div>
		</div>
	);
}

/*
					onSubmit={followHero}
					onSubmit={likeHero}
					onSubmit={commentOnHero}
					onSubmit={uploadImageOfHero}
*/

export default SearchCard;
