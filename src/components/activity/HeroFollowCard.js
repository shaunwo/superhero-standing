import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../private/auth/UserContext';

function HeroFollowCard({
	superhero_id,
	name,
	image,
	intelligence,
	strength,
	speed,
	durability,
	power,
	combat,
}) {
	const { hasFollowedHero, unfollowHero } = useContext(UserContext);

	function handleUnfollowHero() {
		if (!hasFollowedHero(superhero_id)) return;

		// unfollowHero is a method within the SuperheroApi class
		unfollowHero(superhero_id);
	}

	// displaying the search card on the screen
	return (
		<div className="card">
			<div className="card-body">
				<img
					src={image}
					alt={name}
					className="float-right ml-5 rounded"
				/>
				<h3>{name}</h3>
				<h4>Powerstats</h4>
				<ul>
					<li>Intelligence: {intelligence}</li>
					<li>Strength: {strength}</li>
					<li>Speed: {speed}</li>
					<li>Durability: {durability}</li>
					<li>Power: {power}</li>
					<li>Combat: {combat}</li>
				</ul>
			</div>
			<div className="card-footer">
				<a title={`Unfollow ${name}`} onClick={handleUnfollowHero}>
					<img src="/img/unfollow-icon.png" alt="Unfollow" />
				</a>
				<a
					href={`/search/${superhero_id}`}
					title={`More details on ${name}`}
				>
					More Details
				</a>
			</div>
		</div>
	);
}

export default HeroFollowCard;
