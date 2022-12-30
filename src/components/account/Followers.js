import React, { useContext, useState, useEffect } from 'react';
import BackendApi from '../../private/api/backend-api';
import UserContext from '../../private/auth/UserContext';
import MortalFollowerCard from './MortalFollowerCard';
import './ProfileView.css';

function Followers() {
	const {
		currentUser,
		pendingMortalFollowerIds,
		mortalFollowerIds,
	} = useContext(UserContext);

	console.log('pendingMortalFollowerIds: ', pendingMortalFollowerIds);
	console.log('mortalFollowerIds: ', mortalFollowerIds);
	return (
		<>
			<h1>Followers</h1>
			{mortalFollowerIds && mortalFollowerIds.length ? (
				<div className="MortalFollowers">
					<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3">
						{mortalFollowerIds.map((m) => (
							<MortalFollowerCard
								user_id={m}
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
							{pendingMortalFollowerIds.map((n) => (
								<MortalFollowerCard
									user_id={n}
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
