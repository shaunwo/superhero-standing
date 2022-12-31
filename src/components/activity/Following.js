import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../private/auth/UserContext';
import HeroFollowCard from './HeroFollowCard';
import MortalFollowCard from './MortalFollowCard';
import SuperheroApi from '../../private/api/superhero-api';
import BackendApi from '../../private/api/backend-api';
import LoadingSpinner from '../common/LoadingSpinner';

function Following() {
	const {
		heroFollowIds,
		pendingMortalFollowIds,
		mortalFollowIds,
	} = useContext(UserContext);

	const [heroData, setHeroData] = useState();
	const [pendingMortalFollowData, setPendingMortalFollowData] = useState();
	const [mortalFollowData, setMortalFollowData] = useState();

	// finding data for all the heros that the currentUser is following
	const heroFollowArray = [...heroFollowIds];
	useEffect(
		function findAllFollowedHeros() {
			let response = [];
			const a = heroFollowArray.map((h) => SuperheroApi.getHero(h));
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

	// sorting the result set of the heroes by the hero name
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
	}

	// finding data for all the approved mortal followings for the currentUser
	const mortalFollowArray = mortalFollowIds;
	useEffect(
		function findAllMortalFollows() {
			let response = [];
			const c = mortalFollowArray.map((pmf) =>
				BackendApi.getOtherUser(pmf)
			);
			console.log('findAllPendingMortalFollows c: ', c);
			Promise.allSettled([c]).then((result) => {
				result[0].value.forEach(async (result) => {
					await result.then((val) => {
						response.push(val);
						if (response.length === c.length) {
							console.log(
								'findAllPendingMortalFollows response: ',
								response
							);
							setMortalFollowData(response);
						}
					});
				});
			});
		},
		[mortalFollowIds]
	);

	// finding data for all the pending mortal followings for the currentUser
	const pendingMortalFollowArray = pendingMortalFollowIds;
	useEffect(
		function findAllPendingMortalFollows() {
			let response = [];
			const b = pendingMortalFollowArray.map((pmf) =>
				BackendApi.getOtherUser(pmf)
			);
			console.log('findAllPendingMortalFollows b: ', b);
			Promise.allSettled([b]).then((result) => {
				result[0].value.forEach(async (result) => {
					await result.then((val) => {
						response.push(val);
						if (response.length === b.length) {
							console.log(
								'findAllPendingMortalFollows response: ',
								response
							);
							setPendingMortalFollowData(response);
						}
					});
				});
			});
		},
		[pendingMortalFollowIds]
	);

	// sorting the result set of the heroes by the hero name
	function sortUsersByUsername(a, b) {
		if (a.username < b.username) {
			return -1;
		}
		if (a.username > b.username) {
			return 1;
		}
		return 0;
	}
	let sortedMortalFollowData = [];
	if (mortalFollowData) {
		sortedMortalFollowData = mortalFollowData.sort(sortUsersByUsername);
		console.log('sortedMortalFollowData: ', sortedMortalFollowData);
	}
	let sortedPendingMortalFollowData = [];
	if (pendingMortalFollowData) {
		sortedPendingMortalFollowData = pendingMortalFollowData.sort(
			sortUsersByUsername
		);
		console.log(
			'sortedPendingMortalFollowData: ',
			sortedPendingMortalFollowData
		);
	}

	console.log('heroData: ', heroData);
	console.log('mortalFollowIds: ', mortalFollowIds);
	console.log('mortalFollowData: ', mortalFollowData);
	console.log('pendingMortalFollowIds: ', pendingMortalFollowIds);
	console.log('pendingMortalFollowData: ', pendingMortalFollowData);

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
						{sortedMortalFollowData.map((m) => (
							<MortalFollowCard
								user_id={m['user_id']}
								username={m['username']}
								firstName={m['firstName']}
								lastName={m['lastName']}
								location={m['location']}
								heroFollowIds={m['heroFollowIds']}
								heroLikeIds={m['heroLikeIds']}
							/>
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
							{sortedPendingMortalFollowData.map((n) => (
								<MortalFollowCard
									user_id={n['user_id']}
									username={n['username']}
									firstName={n['firstName']}
									lastName={n['lastName']}
									location={n['location']}
									heroFollowIds={n['heroFollowIds']}
									heroLikeIds={n['heroLikeIds']}
								/>
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
