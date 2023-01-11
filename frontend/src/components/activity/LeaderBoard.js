import React, { useContext, useState, useEffect } from 'react';
import BackendApi from '../../private/api/backend-api';
import UserContext from '../../private/auth/UserContext';
import LeaderBoardCard from './LeaderBoardCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './LeaderBoard.css';

function LeaderBoard() {
	const { currentUser } = useContext(UserContext);

	const [leaderBoard, setLeaderBoard] = useState(null);

	// pulling the other user info from API
	useEffect(function getLeaderBoardInfo() {
		async function getLeaderBoard() {
			try {
				let leaderBoardRes = await BackendApi.getLeaderBoard(
					currentUser.user_id
				);
				let leaderBoard = leaderBoardRes;
				setLeaderBoard(leaderBoard);
			} catch (err) {
				console.error(
					'App getLeaderBoardInfo: problem loading',
					err
				);
			}
		}
		getLeaderBoard();
	}, []);

	// displaying the spinner until the API call returns the hero data
	if (!leaderBoard) return <LoadingSpinner />;
	console.log('leaderBoard: ', leaderBoard);

	return (
		<>
			<h1>Leader Board</h1>
			<h2>Top 15 by # of Follows</h2>
			{leaderBoard && leaderBoard.length ? (
				<div id="LeaderBoard">
					<div className="row row-cols row-cols-lg-3 g-2 g-lg-3">
						{leaderBoard.map((a) => (
							<LeaderBoardCard
								superhero_id={a.superhero_id}
								followcount={a.followcount}
								likecount={a.likecount}
								commentcount={a.commentcount}
							/>
						))}
					</div>
				</div>
			) : (
				<p>
					No Leader Board activity yet... why don't YOU go follow
					some heroes?!
				</p>
			)}
		</>
	);
}

export default LeaderBoard;
