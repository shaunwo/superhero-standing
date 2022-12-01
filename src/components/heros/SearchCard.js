import React from 'react';
import { Link } from 'react-router-dom';
import './SearchCard.css';

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
			<div class="card-footer">
				<a href="#" title="Follow">
					<img src="/img/follow-icon.png" alt="Follow" />
				</a>
				<a href="#" title="Unfollow">
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

				<div class="collapse" id={`comments.${id}`}>
					<textarea />
				</div>
				<div class="collapse" id={`upload.${id}`}>
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
