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
		currentUser,
		hasFollowedHero,
		followHero,
		unfollowHero,
		hasLikedHero,
		likeHero,
		unlikeHero,
		commentOnHero,
		uploadHeroImage,
	} = useContext(UserContext);
	const [followed, setFollowed] = useState();
	const [liked, setLiked] = useState();
	const [allUsersFollowed, setAllUsersFollowed] = useState();
	const [allUsersLiked, setAllUsersLiked] = useState();

	const [commentFormData, setCommentFormData] = useState({
		comments: '',
	});
	const [uploadFormData, setUploadFormData] = useState();
	const [image, setImage] = useState('');

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

	// follow/unfollow a hero
	async function handleFollow(evt) {
		if (hasFollowedHero(id)) return;

		// followHero is a method within the SuperheroApi class
		followHero(id);
	}
	async function handleUnfollow(evt) {
		if (!hasFollowedHero(id)) return;

		// followHero is a method within the SuperheroApi class
		unfollowHero(id);
	}

	// like/unlike a hero
	async function handleLike(evt) {
		if (hasLikedHero(id)) return;

		// likeHero is a method within the SuperheroApi class
		likeHero(id);
	}
	async function handleUnlike(evt) {
		if (!hasLikedHero(id)) return;

		// likeHero is a method within the SuperheroApi class
		unlikeHero(id);
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
		document.getElementById('commentsArea.' + id).className =
			'commentsBox collapse';
	}

	// uploading image for a hero
	function handleUpload(e) {
		e.preventDefault();
		console.log('e.target.heroImage: ', e.target.files);
		setImage(e.target.files[0]);
		//uploadFormData.append('image', image);
		console.log('image from state: ' + image);
		console.log(uploadFormData);
		// uploadHeroImage is a method within the SuperheroApi class
		//uploadHeroImage(uploadFormData, id);
		//clearAndHideUpload(id);
	}
	function clearAndHideUpload(id) {
		document.getElementById('upload.' + id).value = '';
		document.getElementById('uploadArea.' + id).className =
			'uploadBox collapse';
	}

	// updating the comment form fields
	function handleCommentChange(evt) {
		const { name, value } = evt.target;
		setCommentFormData((l) => ({ ...l, [name]: value }));
	}
	// updating the upload form fields
	function handleUploadChange(evt) {
		const { name, value } = evt.target;
		setUploadFormData((l) => ({ ...l, [name]: value }));
	}

	console.log('followed: ', followed);
	console.log('allUsersFollowed: ', allUsersFollowed);
	console.log(
		'heroAllUsersFollowedIds: ',
		currentUser.heroAllUsersFollowedIds
	);
	console.log(
		'heroAllUsersCommentsIds: ',
		currentUser.heroAllUsersCommentsIds
	);

	let heroAllUsersFollowedCount = !currentUser.heroAllUsersFollowedIds[id]
		? 0
		: currentUser.heroAllUsersFollowedIds[id];
	let heroAllUsersLikedCount = !currentUser.heroAllUsersLikedIds[id]
		? 0
		: currentUser.heroAllUsersLikedIds[id];

	let heroAllUsersCommentsCount = !currentUser.heroAllUsersCommentsIds[id]
		? 0
		: currentUser.heroAllUsersCommentsIds[id];

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
				<p>ID: {id}</p>
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
				{hasFollowedHero(id) && (
					<a title={`Unfollow ${name}`} onClick={handleUnfollow}>
						<img
							src="/img/unfollow-icon.png"
							alt="Unfollow"
						/>
					</a>
				)}
				{!hasFollowedHero(id) && (
					<a title={`Follow ${name}`} onClick={handleFollow}>
						<img src="/img/follow-icon.png" alt="Follow" />
					</a>
				)}
				<span
					className="activity-counter"
					title={`${heroAllUsersFollowedCount} Follow(s) on ${name}`}
				>
					{heroAllUsersFollowedCount}
				</span>
				{hasLikedHero(id) && (
					<a title={`Unlike ${name}`} onClick={handleUnlike}>
						<img src="/img/unlike-icon.png" alt="Unlike" />
					</a>
				)}
				{!hasLikedHero(id) && (
					<a title={`Like ${name}`} onClick={handleLike}>
						<img src="/img/like-icon.png" alt="Like" />
					</a>
				)}
				<span
					className="activity-counter"
					title={`${heroAllUsersLikedCount} Like(s) on ${name}`}
				>
					{heroAllUsersLikedCount}
				</span>
				<a
					data-toggle="collapse"
					href={`#commentsArea.${id}`}
					title={`Comment on ${name}`}
				>
					<img src="/img/comment-icon.png" alt="Comment" />
				</a>
				<span
					className="activity-counter"
					title={`${heroAllUsersCommentsCount} Comment(s) on ${name}`}
				>
					{heroAllUsersCommentsCount}
				</span>
				<a
					data-toggle="collapse"
					href={`#uploadArea.${id}`}
					title={`Upload YOUR Image for ${name}`}
				>
					<img
						src="/img/upload-image-icon.png"
						alt={`Upload YOUR Image for ${name}`}
					/>
				</a>
				<span className="activity-counter">NumImages</span>
				<div
					className="collapse commentsBox"
					id={`commentsArea.${id}`}
				>
					<form onSubmit={handleComment}>
						<textarea
							name="comments"
							value={commentFormData.comments}
							onChange={handleCommentChange}
							rows="3"
							cols="70"
							className="form-control"
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
				<div className="collapse uploadBox" id={`uploadArea.${id}`}>
					<input
						type="file"
						id={`upload.${id}`}
						onChange={handleUpload}
						name="file"
						className="form-control"
					/>
					<button className="btn btn-sm btn-primary">
						Upload Image
					</button>
				</div>
			</div>
		</div>
	);
}

export default SearchCard;
