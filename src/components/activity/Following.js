import React, { useContext } from 'react';
import UserContext from '../../private/auth/UserContext';
import HeroFollowCard from './HeroFollowCard';
import MortalFollowCard from './MortalFollowCard';
import SuperheroApi from '../../private/api/superhero-api';
//import axios from 'axios';

function Following() {
	const { currentUser, heroFollowIds } = useContext(UserContext);

	console.log('currentUser: ', currentUser);
	console.log('heroFollowedIds: ', currentUser.heroFollowedIds);

	currentUser.heroFollowedIds.map((h) =>
		console.log('heroFollowedId: ' + h)
	);

	async function findAllFollowedHeros() {
		//let baseURL = 'http://localhost:3001/api/hero';
		let heroData = await Promise.all([
			currentUser.heroFollowedIds.map(
				(h) => SuperheroApi.getHero(h)
				//console.log(${baseURL}/${h})
			),
		]).then((result) => {
			console.log(result);
		});
		console.log(heroData);
	}
	findAllFollowedHeros();

	return (
		<>
			<h1>Following</h1>
			<p>Work in progress...</p>
			<h2>Superheros</h2>
			{currentUser.heroFollowedIds &&
			currentUser.heroFollowedIds.length ? (
				<div className="SuperheroFollows">
					<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
						{currentUser.heroFollowedIds.map((h) => (
							<HeroFollowCard superhero_id={h} />
						))}
					</div>
				</div>
			) : (
				<p>No superhero follows yet... what are you waiting for?</p>
			)}
			<h2>Mere Mortals</h2>
			{currentUser.mortalFollowedIds &&
			currentUser.mortalFollowedIds.length ? (
				<div className="MortalFollows">
					<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
						{currentUser.mortalFollowedIds.map((m) => (
							<MortalFollowCard user_id={m} />
						))}
					</div>
				</div>
			) : (
				<p>No superhero follows yet... what are you waiting for?</p>
			)}
		</>
	);
}

export default Following;
