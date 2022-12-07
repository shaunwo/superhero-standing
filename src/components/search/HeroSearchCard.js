import React, { useContext, useState } from 'react';
import UserContext from '../../private/auth/UserContext';
import './HeroSearchCard.css';

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
	const {
		hasFollowedHero,
		followHero,
		unfollowHero,
		hasLikedHero,
		likeHero,
		unlikeHero,
		hasAllUsersFollowedHero,
		hasAllUsersLikedHero,
		commentOnHero,
	} = useContext(UserContext);
	const [followed, setFollowed] = useState();
	const [liked, setLiked] = useState();
	const [allUsersFollowed, setAllUsersFollowed] = useState();
	const [allUsersLiked, setAllUsersLiked] = useState();

	const [commentFormData, setCommentFormData] = useState({
		comments: '',
	});

	React.useEffect(
		function updateFollowedStatus() {
			console.log(
				'HeroCard useEffect updateFollowedStatus',
				'id=',
				id
			);
			console.log('inside React.useEffect id: ' + id);
			setFollowed(hasFollowedHero(id));
			console.log(hasFollowedHero(id));
		},
		[id, hasFollowedHero]
	);
	React.useEffect(
		function updateLikedStatus() {
			console.log('HeroCard useEffect updateLikedStatus', 'id=', id);
			console.log('inside React.useEffect id: ' + id);
			setLiked(hasLikedHero(id));
			console.log(hasLikedHero(id));
		},
		[id, hasLikedHero]
	);
	React.useEffect(
		function updateAllUserFollowedStatus() {
			setAllUsersFollowed(hasAllUsersFollowedHero(id));
			console.log(hasAllUsersFollowedHero(id));
		},
		[id, hasAllUsersFollowedHero]
	);
	React.useEffect(
		function updateAllUserLikedStatus() {
			setAllUsersLiked(hasAllUsersLikedHero(id));
			console.log(hasAllUsersLikedHero(id));
		},
		[id, hasAllUsersLikedHero]
	);

	// follow/unfollow a hero
	async function handleFollow(evt) {
		if (hasFollowedHero(id)) return;

		// followHero is a method within the SuperheroApi class
		followHero(id);
		setFollowed(true);
	}
	async function handleUnfollow(evt) {
		if (!hasFollowedHero(id)) return;

		// followHero is a method within the SuperheroApi class
		unfollowHero(id);
		setFollowed(false);
	}

	// like/unlike a hero
	async function handleLike(evt) {
		if (hasLikedHero(id)) return;

		// likeHero is a method within the SuperheroApi class
		likeHero(id);
		setLiked(true);
	}
	async function handleUnlike(evt) {
		if (!hasLikedHero(id)) return;

		// likeHero is a method within the SuperheroApi class
		unlikeHero(id);
		setLiked(false);
	}

	// add comment for a hero
	async function handleComment(evt) {
		evt.preventDefault();
		// commentOnHero is a method within the SuperheroApi class
		commentOnHero(commentFormData, id);
		clearAndHideComments(id);
	}

	function clearAndHideComments(id) {
		document.getElementById('comments.' + id).value = '';
		document.getElementById('comments.' + id).className =
			'commentsBox collapse';
	}

	// updating the comment form fields
	function handleChange(evt) {
		const { name, value } = evt.target;
		setCommentFormData((l) => ({ ...l, [name]: value }));
	}

	console.log('allUsersFollowed: ', allUsersFollowed);

	// displaying the search card on the screen
	return (
		<div className="card">
			<div className="card-body">
				{imageUrl && (
					<img
						src={imageUrl}
						alt={name}
						className="float-right ml-5 rounded"
					/>
				)}
				<h2 className="card-title">{name}</h2>
				<h3>Powerstats</h3>
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
							href={`/search/${id}`}
							title={`More details on ${name}`}
						>
							More Details
						</a>
					</small>
				</p>
			</div>
			<div className="card-footer">
				{followed && (
					<a title="Unfollow" onClick={handleUnfollow}>
						<img
							src="/img/unfollow-icon.png"
							alt="Unfollow"
						/>
					</a>
				)}
				{!followed && (
					<a title="Follow" onClick={handleFollow}>
						<img src="/img/follow-icon.png" alt="Follow" />
					</a>
				)}
				<span className="activity-counter">NumFollows</span>
				{liked && (
					<a title="Unlike" onClick={handleUnlike}>
						<img src="/img/unlike-icon.png" alt="Unlike" />
					</a>
				)}
				{!liked && (
					<a title="Like" onClick={handleLike}>
						<img src="/img/like-icon.png" alt="Like" />
					</a>
				)}
				<span className="activity-counter">NumLikes</span>
				<a
					data-toggle="collapse"
					href={`#commentsArea.${id}`}
					title="Comment"
				>
					<img src="/img/comment-icon.png" alt="Comment" />
				</a>
				<span className="activity-counter">NumComments</span>
				<a
					data-toggle="collapse"
					href={`#upload.${id}`}
					title="Upload YOUR Image"
				>
					<img
						src="/img/upload-image-icon.png"
						alt="Upload YOUR Image"
					/>
				</a>
				<span className="activity-counter">NumComments</span>
				<div
					className="collapse commentsBox"
					id={`commentsArea.${id}`}
				>
					<form onSubmit={handleComment}>
						<textarea
							name="comments"
							value={commentFormData.comments}
							onChange={handleChange}
							rows="3"
							cols="70"
							className="commentsTextArea"
							id={`comments.${id}`}
						/>
						<button
							className="btn btn-sm btn-primary"
							onClick={handleComment}
						>
							Add Comment
						</button>
					</form>
				</div>
				<div className="collapse" id={`upload.${id}`}>
					<input type="file" id="myFile" name="filename" />
				</div>
			</div>
		</div>
	);
}

/*
					onSubmit={followHero}
					onSubmit={likeHero}
					onSubmit={commentOnHero}
					onSubmit={uploadImageOfHero}
*/

export default SearchCard;
