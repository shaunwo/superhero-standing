import React, { useContext, useState, useEffect } from 'react';
import BackendApi from '../../private/api/backend-api';
import UserContext from '../../private/auth/UserContext';
import MortalFollowerCard from './MortalFollowerCard';
import './ProfileView.css';

function Followers() {
	const { pendingMortalFollowerIds, mortalFollowerIds } = useContext(
		UserContext
	);

	const [
		pendingMortalFollowerData,
		setPendingMortalFollowerData,
	] = useState();
	const [mortalFollowerData, setMortalFollowerData] = useState();

	// finding data for all the approved mortal followers for the currentUser
	const mortalFollowerArray = mortalFollowerIds;
	useEffect(
		function findAllMortalFollowers() {
			let response = [];
			const c = mortalFollowerArray.map((pmf) =>
				BackendApi.getOtherUser(pmf)
			);
			console.log('findAllPendingMortalFollowers c: ', c);
			Promise.allSettled([c]).then((result) => {
				result[0].value.forEach(async (result) => {
					await result.then((val) => {
						response.push(val);
						if (response.length === c.length) {
							console.log(
								'findAllPendingMortalFollowers response: ',
								response
							);
							setMortalFollowerData(response);
						}
					});
				});
			});
		},
		[mortalFollowerIds]
	);

	// finding data for all the pending mortal followings for the currentUser
	const pendingMortalFollowerArray = pendingMortalFollowerIds;
	useEffect(
		function findAllPendingMortalFollowers() {
			let response = [];
			const b = pendingMortalFollowerArray.map((pmf) =>
				BackendApi.getOtherUser(pmf)
			);
			console.log('findAllPendingMortalFollowers b: ', b);
			Promise.allSettled([b]).then((result) => {
				result[0].value.forEach(async (result) => {
					await result.then((val) => {
						response.push(val);
						if (response.length === b.length) {
							console.log(
								'findAllPendingMortalFollowers response: ',
								response
							);
							setPendingMortalFollowerData(response);
						}
					});
				});
			});
		},
		[pendingMortalFollowerIds]
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
	let sortedMortalFollowerData = [];
	if (mortalFollowerData) {
		sortedMortalFollowerData = mortalFollowerData.sort(
			sortUsersByUsername
		);
		console.log('sortedMortalFollowerData: ', sortedMortalFollowerData);
	}
	let sortedPendingMortalFollowerData = [];
	if (pendingMortalFollowerData) {
		sortedPendingMortalFollowerData = pendingMortalFollowerData.sort(
			sortUsersByUsername
		);
		console.log(
			'sortedPendingMortalFollowerData: ',
			sortedPendingMortalFollowerData
		);
	}

	console.log('mortalFollowerIds: ', mortalFollowerIds);
	console.log('sortedMortalFollowerData: ', sortedMortalFollowerData);
	console.log('pendingMortalFollowerIds: ', pendingMortalFollowerIds);
	console.log(
		'sortedPendingMortalFollowerData: ',
		sortedPendingMortalFollowerData
	);
	return (
		<>
			<h1>Followers</h1>
			{mortalFollowerIds && mortalFollowerIds.length ? (
				<div className="MortalFollowers">
					<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
						{sortedMortalFollowerData.map((m) => (
							<MortalFollowerCard
								user_id={m['user_id']}
								username={m['username']}
								firstName={m['firstName']}
								lastName={m['lastName']}
								location={m['location']}
								heroFollowIds={m['heroFollowIds']}
								heroLikeIds={m['heroLikeIds']}
								approveBtn={false}
							/>
						))}
					</div>
				</div>
			) : (
				<p>
					No (approved) mere mortal followers yet... why not make
					some friends on this app?
				</p>
			)}
			{pendingMortalFollowerIds && pendingMortalFollowerIds.length ? (
				<>
					<h3>Pending</h3>
					<div className="MortalFollowers">
						<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
							{sortedPendingMortalFollowerData.map((n) => (
								<MortalFollowerCard
									user_id={n['user_id']}
									username={n['username']}
									firstName={n['firstName']}
									lastName={n['lastName']}
									location={n['location']}
									heroFollowIds={n['heroFollowIds']}
									heroLikeIds={n['heroLikeIds']}
									approveBtn={true}
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

export default Followers;
