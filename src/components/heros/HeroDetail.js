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
		<div className="HeroDetail col-md-8 offset-md-2">
			{hero.image.url && (
				<img
					src={hero.image.url}
					alt={hero.name}
					className="float-right ml-5"
				/>
			)}
			<h2>{hero.name}</h2>
			<h3>Powerstats</h3>
			<ul>
				<li>Intelligence: {hero.powerstats.intelligence}</li>
				<li>Strength: {hero.powerstats.strength}</li>
				<li>Speed: {hero.powerstats.speed}</li>
				<li>Durability: {hero.powerstats.durability}</li>
				<li>Power: {hero.powerstats.power}</li>
				<li>Combat: {hero.powerstats.combat}</li>
			</ul>
			<h3>Biography</h3>
			<ul>
				<li>Publisher: {hero.biography.publisher}</li>
				<li>Alignment: {hero.biography.alignment}</li>
			</ul>
			<h3>Appearance</h3>
			<ul>
				<li>Gender: {hero.appearance.gender}</li>
				<li>Race: {hero.appearance.race}</li>
				<li>Height: {hero.appearance.height[0]}</li>
				<li>Weight: {hero.appearance.weight[0]}</li>
			</ul>
			[1]{' '}
			{/* 'alter-egos': 'No alter egos found.',
[1]     aliases: [ '-' ],
[1]     'place-of-birth': 'Somewhere in the Bavarian Alps',
[1]     'first-appearance': 'GIANT-SIZE X-MEN #1',
               </ul>


[1]   },
[1]   appearance: {
[1]     gender: 'Male',
[1]     race: 'null',
[1]     height: [ "5'9'", '175 cm' ],
[1]     weight: [ '195 lb', '88 kg' ],
[1]     'eye-color': 'Yellow',
[1]     'hair-color': 'Indigo'
[1]   },
[1]   work: {
[1]     occupation: 'Adventurer, Teacher',
[1]     base: 'Xavier Institute for Higher Learning, Salem Center, Westchester County, New York (former) Muir Island, Scotland; Braddock Lighthouse'
[1]   },
[1]   connections: {
[1]     'group-affiliation': 'X-Men, formerly Excalibur',
[1]     relatives: 'Eric Wagner (father, deceased), Margali Szardos (foster mother), Jimaine Szardos (Daytripper, alias Amanda Sefton, foster sister), Stefan Szardos (foster brother, deceased), Mystique (mother), Graydon Creed (half-brother, deceased).'
[1]   }, */}
		</div>
	);
}

export default HeroDetail;
