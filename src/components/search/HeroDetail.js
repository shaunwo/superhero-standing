import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../private/auth/UserContext';
import BackendApi from '../../private/api/backend-api';
import SuperheroApi from '../../private/api/superhero-api';
import LoadingSpinner from '../common/LoadingSpinner';
import CommentCard from './HeroCommentCard';
import './HeroDetail.css';

/** Hero Detail page.
 *
 * Renders information about hero
 *
 * Routed at /heroes/:id
 *
 * Routes -> HeroDetail -> JobCardList
 */

function HeroDetail() {
	const { id } = useParams();
	console.debug('HeroDetail', 'id=', id);
	const {
		currentUser,
		hasFollowedHero,
		followHero,
		unfollowHero,
		hasLikedHero,
		likeHero,
		unlikeHero,
		commentOnHero,
	} = useContext(UserContext);
	const [followed, setFollowed] = useState();
	const [liked, setLiked] = useState();
	const [allUsersFollowed, setAllUsersFollowed] = useState();
	const [allUsersLiked, setAllUsersLiked] = useState();
	const [heroComments, setHeroComments] = useState();
	const [commentFormData, setCommentFormData] = useState({
		comments: '',
	});

	// setting hero in state
	const [hero, setHero] = useState(null);

	useEffect(
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
	useEffect(
		function updateLikedStatus() {
			console.log('HeroCard useEffect updateLikedStatus', 'id=', id);
			console.log('inside React.useEffect id: ' + id);
			setLiked(hasLikedHero(id));
			console.log(hasLikedHero(id));
		},
		[id, hasLikedHero]
	);

	// generating details for hero
	useEffect(
		function getHeroDetails() {
			async function getHero() {
				console.log('ID of hero: ' + id);
				let heroResults = await SuperheroApi.getHero(id);
				console.log(
					'Hero from API call: ' + JSON.stringify(heroResults)
				);
				let hero = heroResults.data.data;
				console.log('hero:', hero);
				setHero(hero);
			}

			getHero();
		},
		[id]
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

	// pulling comments for the hero
	useEffect(
		function getHeroComments() {
			async function getHeroCommentsAPI() {
				try {
					let heroCommentsRes = await BackendApi.getUserComments(
						id
					);
					let heroComments = heroCommentsRes;
					console.log('heroComments: ', heroComments);
					setHeroComments(heroComments);
				} catch (err) {
					console.error(
						'App getHeroCommentsAPI: problem loading',
						err
					);
				}
			}
			getHeroCommentsAPI();
		},
		[id]
	);

	// displaying the spinner until the API call returns the heroes data
	if (!hero) return <LoadingSpinner />;

	let heroAllUsersFollowedCount = !currentUser.heroAllUsersFollowedIds[id]
		? 0
		: currentUser.heroAllUsersFollowedIds[id];
	let heroAllUsersLikedCount = !currentUser.heroAllUsersLikedIds[id]
		? 0
		: currentUser.heroAllUsersLikedIds[id];

	let heroAllUsersCommentsCount = !currentUser.heroAllUsersCommentsIds[id]
		? 0
		: currentUser.heroAllUsersCommentsIds[id];

	// displaying the hero details on the screen
	return (
		<div className="HeroDetail">
			<div className="container-fluid">
				<h1>{hero['name']}</h1>

				<div className="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3 justify-content-around">
					<div className="col-lg-4 px-5 imgBox">
						{hero['image']['url'] && (
							<img
								src={hero['image']['url']}
								alt={hero['name']}
								className="rounded mx-auto d-block"
							/>
						)}
					</div>
					<div className="col-lg-4 details-block">
						<h2>Powerstats</h2>
						<ul>
							<li>
								Intelligence:{' '}
								{hero.powerstats['intelligence']}
							</li>
							<li>
								Strength: {hero.powerstats['strength']}
							</li>
							<li>Speed: {hero.powerstats['speed']}</li>
							<li>
								Durability:{' '}
								{hero.powerstats['durability']}
							</li>
							<li>Power: {hero.powerstats['power']}</li>
							<li>Combat: {hero.powerstats['combat']}</li>
						</ul>
					</div>
					<div className="col-lg-4 details-block">
						<h2>Biography</h2>
						<ul>
							<li>
								Full Name: {hero.biography['full-name']}
							</li>
							<li>
								Alter Egos:{' '}
								{hero.biography['alter-egos']}
							</li>
							<li>Aliases: {hero.biography['aliases']}</li>
							<li>
								Place of Birth:{' '}
								{hero.biography['place-of-birth']}
							</li>
							<li>
								First Appearance:{' '}
								{hero.biography['first-appearance']}
							</li>
							<li>
								Publisher: {hero.biography['publisher']}
							</li>
							<li>
								Alignment: {hero.biography['alignment']}
							</li>
						</ul>
					</div>
					<div className="col-lg-4 details-block">
						<h2>Appearance</h2>
						<ul>
							<li>Gender: {hero.appearance['gender']}</li>
							<li>Race: {hero.appearance['race']}</li>
							<li>
								Height: {hero.appearance['height'][0]}
							</li>
							<li>
								Weight: {hero.appearance['weight'][0]}
							</li>
							<li>
								Eye Color:{' '}
								{hero.appearance['eye-color']}
							</li>
							<li>
								Hair Color:{' '}
								{hero.appearance['hair-color']}
							</li>
						</ul>
					</div>
					<div className="col-lg-4 details-block">
						<h2>Work</h2>
						<ul>
							<li>
								Occupation: {hero.work['occupation']}
							</li>
							<li>Base: {hero.work['base']}</li>
						</ul>
					</div>
					<div className="col-lg-4 details-block">
						<h2>Connections</h2>
						<ul>
							<li>
								Group Affiliation:{' '}
								{hero.connections['group-affiliation']}
							</li>
							<li>
								Relatives:{' '}
								{hero.connections['relatives']}
							</li>
						</ul>
					</div>
				</div>
				<div class="row row-cols-md-2 row-cols-lg-3 g-2 g-lg-3 justify-content-around">
					<div className="col-lg-6 details-block">
						<h2>User Comments</h2>
						{heroComments && heroComments.length ? (
							<div className="SuperheroComments">
								{heroComments.map((c) => (
									<CommentCard
										user_id={c.user_id}
										comment={c.comments}
										created_dt={c.created_dt}
										username={c.username}
									/>
								))}
							</div>
						) : (
							<p>No comments on this hero, yet.</p>
						)}
					</div>
					<div className="col-lg-6 details-block">
						<h2>User Images</h2>
						<p>Coming soon...</p>
					</div>
				</div>
			</div>

			<div className="card" id="heroActions">
				<div className="card-footer">
					{followed && (
						<a
							title={`Unfollow ${hero['name']}`}
							onClick={handleUnfollow}
						>
							<img
								src="/img/unfollow-icon.png"
								alt="Unfollow"
							/>
						</a>
					)}
					{!followed && (
						<a
							title={`Follow ${hero['name']}`}
							onClick={handleFollow}
						>
							<img
								src="/img/follow-icon.png"
								alt="Follow"
							/>
						</a>
					)}
					<span
						className="activity-counter"
						title={`${heroAllUsersFollowedCount} Follow(s) on ${hero['name']}`}
					>
						{heroAllUsersFollowedCount}
					</span>
					{liked && (
						<a
							title={`Unlike ${hero['name']}`}
							onClick={handleUnlike}
						>
							<img
								src="/img/unlike-icon.png"
								alt="Unlike"
							/>
						</a>
					)}
					{!liked && (
						<a
							title={`Like ${hero['name']}`}
							onClick={handleLike}
						>
							<img src="/img/like-icon.png" alt="Like" />
						</a>
					)}
					<span
						className="activity-counter"
						title={`${heroAllUsersLikedCount} Like(s) on ${hero['name']}`}
					>
						{heroAllUsersLikedCount}
					</span>
					<a
						data-toggle="collapse"
						href={`#commentsArea.${id}`}
						title={`Comment on ${hero['name']}`}
					>
						<img src="/img/comment-icon.png" alt="Comment" />
					</a>
					<span
						className="activity-counter"
						title={`${heroAllUsersCommentsCount} Comment(s) on ${hero['name']}`}
					>
						{heroAllUsersCommentsCount}
					</span>
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
					<span className="activity-counter">NumImages</span>
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
		</div>
	);
}

export default HeroDetail;
