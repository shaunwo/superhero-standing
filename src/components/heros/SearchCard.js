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
						className="float-right ml-5"
					/>
				)}
				<h3 className="card-title">{name}</h3>
				<h4>Powerstats</h4>
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
							href={`/hero/${id}`}
							title={`More details on ${name}`}
						>
							More Details
						</a>
					</small>
				</p>
			</div>
		</div>
	);
}

export default SearchCard;
