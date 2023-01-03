import React, { useContext, useState, useEffect } from 'react';
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
		heroFollowIds,
		uploadHeroImage,
	} = useContext(UserContext);
	const [heroLikeIds, setHeroLikeIds] = useState();
	const [commentFormData, setCommentFormData] = useState({
		comments: '',
	});
	const [image, setImage] = useState('');
	const [url, setUrl] = useState('');

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

		// unlikeHero is a method within the SuperheroApi class
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

	// uploading a user-provided image
	const uploadImage = () => {
		const data = new FormData();
		data.append('file', image);
		data.append('upload_preset', 'superhero-standing');
		data.append('cloud_name', 'dqg8wxsqn');
		fetch('  https://api.cloudinary.com/v1_1/dqg8wxsqn/image/upload', {
			method: 'post',
			body: data,
		})
			.then((resp) => resp.json())
			.then((data) => {
				setUrl(data.url);
				clearAndHideUpload(id);
			})
			.then({})
			.catch((err) => console.log(err));
	};
	if (url) {
		console.log(
			'cloudinaryURL inside uploadImage on components > search > HeroSearchCard.js: ' +
				url
		);
		uploadHeroImage(url, id);
		setUrl(null);
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

	console.log('heroFollowIds: ', heroFollowIds);
	console.log('heroAllUsersFollowIds: ', currentUser.heroAllUsersFollowIds);
	console.log(
		'heroAllUsersCommentsIds: ',
		currentUser.heroAllUsersCommentsIds
	);

	let heroAllUsersFollowedCount = !currentUser.heroAllUsersFollowIds[id]
		? 0
		: currentUser.heroAllUsersFollowIds[id];
	let heroAllUsersLikedCount = !currentUser.heroAllUsersLikeIds[id]
		? 0
		: currentUser.heroAllUsersLikeIds[id];

	let heroAllUsersCommentsCount = !currentUser.heroAllUsersCommentsIds[id]
		? 0
		: currentUser.heroAllUsersCommentsIds[id];
	let heroAllUsersImagesCount = !currentUser.heroAllUsersImagesIds[id]
		? 0
		: currentUser.heroAllUsersImagesIds[id];

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
			</div>
			<div className="card-footer">
				{heroFollowIds.has(+id) && (
					<a title={`Unfollow ${name}`} onClick={handleUnfollow}>
						<img
							src="/img/unfollow-icon.png"
							alt="Unfollow"
						/>
					</a>
				)}
				{!heroFollowIds.has(+id) && (
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
				<span
					className="activity-counter"
					title={`${heroAllUsersImagesCount} Image(s) for ${name}`}
				>
					{heroAllUsersImagesCount}
				</span>

				<a href={`/search/${id}`} title={`More details on ${name}`}>
					More Details
				</a>

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
						onChange={(e) => setImage(e.target.files[0])}
						className="form-control"
					/>
					<button
						className="btn btn-sm btn-primary"
						onClick={uploadImage}
					>
						Upload Image
					</button>
				</div>
			</div>
		</div>
	);
}

export default SearchCard;
