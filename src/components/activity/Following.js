import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../private/auth/UserContext';
import HeroFollowCard from './HeroFollowCard';
import MortalFollowCard from './MortalFollowCard';
import SuperheroApi from '../../private/api/superhero-api';
import LoadingSpinner from '../common/LoadingSpinner';

function Following() {
	const {
		currentUser,
		heroFollowIds,
		pendingMortalFollowIds,
		mortalFollowIds,
	} = useContext(UserContext);

	const [heroData, setHeroData] = useState();

	console.log('currentUser: ', currentUser);
	const heroFollowArray = [...heroFollowIds];
	console.log('heroFollowIds: ', heroFollowIds);
	console.log('heroFollowArray: ', heroFollowArray);

	heroFollowArray.map((h) => console.log('heroFollowIds: ' + h));

	useEffect(
		function findAllFollowedHeros() {
			let response = [];
			const a = heroFollowArray
				.sort()
				.map((h) => SuperheroApi.getHero(h));
			console.log(a);
			Promise.allSettled([a]).then((result) => {
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
		},
		[heroFollowIds]
	);

	function sortHerosByName(a, b) {
		if (a.data.name < b.data.name) {
			return -1;
		}
		if (a.data.name > b.data.name) {
			return 1;
		}
		return 0;
	}

	let sortedHeroData = [];
	if (heroData) {
		sortedHeroData = heroData.sort(sortHerosByName);
		console.log('sortedHeroData: ', sortedHeroData);
	}
	//findAllFollowedHeros();
	console.log('heroData: ', heroData);
	console.log('pendingMortalFollowIds: ', pendingMortalFollowIds);
	console.log('mortalFollowIds: ', mortalFollowIds);

	// displaying the spinner until the API call returns the companies data
	if (!heroData) return <LoadingSpinner />;

	return (
		<>
			<h1>Following</h1>
			<h2>Superheros</h2>
			{heroFollowArray && heroFollowArray.length ? (
				<div className="SuperheroFollows">
					<div className="row row-cols row-cols-lg-3 g-2 g-lg-3">
						{sortedHeroData.map((h) => (
							<HeroFollowCard
								superhero_id={h.data.id}
								name={h.data.name}
								image={h.data.image['url']}
								intelligence={
									h.data.powerstats['intelligence']
								}
								strength={h.data.powerstats['strength']}
								speed={h.data.powerstats['speed']}
								durability={
									h.data.powerstats['durability']
								}
								power={h.data.powerstats['power']}
								combat={h.data.powerstats['combat']}
							/>
						))}
					</div>
				</div>
			) : (
				<p>No superhero follows yet... what are you waiting for?</p>
			)}
			<h2>Mere Mortals</h2>
			{mortalFollowIds && mortalFollowIds.length ? (
				<div className="MortalFollows">
					<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
						{mortalFollowIds.map((m) => (
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
			{pendingMortalFollowIds && pendingMortalFollowIds.length ? (
				<>
					<h3>Pending</h3>
					<div className="MortalFollows">
						<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
							{pendingMortalFollowIds.map((n) => (
								<MortalFollowCard user_id={n} />
							))}
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
