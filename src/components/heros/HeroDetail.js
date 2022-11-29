import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SuperheroApi from '../../private/api/superhero-api';
import LoadingSpinner from '../common/LoadingSpinner';
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

	// setting hero in state
	const [hero, setHero] = useState(null);

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

	console.log(hero);

	// displaying the spinner until the API call returns the heroes data
	if (!hero) return <LoadingSpinner />;

	// displaying the hero details on the screen
	return (
		<div className="HeroDetail">
			<div class="container">
				<h1>{hero['name']}</h1>
				<div class="row">
					<div className="col-lg-4 col-md-1 col-sm-1 details-block">
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
					<div className="col-lg-4 col-md-1 col-sm-1 details-block">
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
					<div className="col-lg-4 col-md-1 col-sm-1">
						{hero['image']['url'] && (
							<img
								src={hero['image']['url']}
								alt={hero['name']}
								className="rounded mx-auto d-block"
							/>
						)}
					</div>
				</div>
				<div class="row">
					<div className="col-lg-4 col-md-1 col-sm-1 details-block">
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
					<div className="col-lg-4 col-md-1 col-sm-1 details-block">
						<h2>Work</h2>
						<ul>
							<li>
								Occupation: {hero.work['occupation']}
							</li>
							<li>Base: {hero.work['base']}</li>
						</ul>
					</div>
					<div className="col-lg-4 col-md-1 col-sm-1 details-block">
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
			</div>
		</div>
	);
}

export default HeroDetail;
