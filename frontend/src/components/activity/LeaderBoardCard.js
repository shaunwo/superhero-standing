import React, { useContext, useState, useEffect } from 'react';
import SuperheroApi from '../../private/api/superhero-api';
import UserContext from '../../private/auth/UserContext';
import LoadingSpinner from '../common/LoadingSpinner';

function LeaderBoardCard({
	superhero_id,
	followcount,
	likecount,
	commentcount,
}) {
	const [heroDetails, setHeroheroDetails] = useState();

	// setting heroDetails in state
	useEffect(function getHeroInfo() {
		async function getHeroDetails() {
			try {
				let heroResults = await SuperheroApi.getHero(superhero_id);
				let heroDetails = heroResults.data.data;
				setHeroheroDetails(heroDetails);
			} catch (err) {
				console.error('App getHeroDetails: problem loading', err);
			}
		}
		getHeroDetails();
	}, []);

	//console.log('heroDetails on LeaderBoardCard.js: ', heroDetails);

	if (!heroDetails) return <LoadingSpinner />;

	const dispLikeCount = likecount ? likecount : 0;
	const dispCommentCount = commentcount ? commentcount : 0;

	// displaying the leader card on the screen
	return (
		<div className="card">
			<div className="card-body">
				{heroDetails.image.url && (
					<img
						src={heroDetails.image.url}
						alt={heroDetails.name}
						className="float-right ml-5 rounded"
					/>
				)}
				<h3>{heroDetails.name}</h3>
				<div>{followcount} Follows</div>
				<div>{dispLikeCount} Likes</div>
				<div>{dispCommentCount} Comments</div>
			</div>
			<div className="card-footer">
				<a
					href={`/search/${superhero_id}`}
					title={`More details on ...`}
				>
					More Details
				</a>
			</div>
		</div>
	);
}

export default LeaderBoardCard;
