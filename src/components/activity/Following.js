import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';
import HeroFollowCard from './HeroFollowCard';
import MortalFollowCard from './MortalFollowCard';
import SuperheroApi from '../../private/api/superhero-api';
import axios from 'axios';

function Following() {
	const { currentUser, heroFollowedIds } = useContext(UserContext);

	const [heroData, setHeroData] = useState();

	console.log('currentUser: ', currentUser);
	console.log('heroFollowedIds: ', currentUser.heroFollowedIds);

	currentUser.heroFollowedIds.map((h) =>
		console.log('heroFollowedId: ' + h)
	);

	async function findAllFollowedHeros() {
		let response = [];
		const a = currentUser.heroFollowedIds.map((h) =>
			SuperheroApi.getHero(h)
		);
		console.log(a);
		await Promise.allSettled([a]).then((result) => {
			result[0].value.forEach(async (result) => {
				await result.then((val) => {
					response.push(val.data);
					if (response.length === a.length) {
						console.log(response);
						setHeroData(response);
					}
				});
			});
		});
	}
	findAllFollowedHeros();
	console.log('heroData: ', heroData);
	console.log(
		'pendingMortalFollowedIds: ',
		currentUser.pendingMortalFollowedIds
	);

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
				<p>
					No (approved) mere mortal follows yet... why not make
					some friends on this app?
				</p>
			)}
			{currentUser.pendingMortalFollowedIds &&
			currentUser.pendingMortalFollowedIds.length ? (
				<>
					<h3>Pending</h3>
					<div className="MortalFollows">
						<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
							{currentUser.pendingMortalFollowedIds.map(
								(n) => (
									<MortalFollowCard user_id={n} />
								)
							)}
						</div>
					</div>
				</>
			) : (
				''
			)}
		</>
	);
}

export default Following;
