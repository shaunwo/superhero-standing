import React, { useState, useEffect } from 'react';
import SearchForm from './common/SearchForm';
import SearchCard from './heros/SearchCard';
import SuperheroApi from '../private/api/superhero-api';
//import LoadingSpinner from './common/LoadingSpinner';

function Search() {
	console.log('Search for superheros');

	// setting companies in state
	const [heros, setHeros] = useState(null);

	// generating list of superheros
	useEffect(function getHerosOnMount() {
		console.debug('SuperheroList useEffect getSuperherosOnMount');
		search();
	}, []);

	// trigger another API call if search is entered
	async function search(name) {
		if (name) {
			let searchResults = await SuperheroApi.getHeros(name);
			console.log(
				'Heros from api call: ' + JSON.stringify(searchResults)
			);
			let heros = searchResults.data.data;
			console.log('heros:', heros);
			setHeros(heros);
		}
	}

	// displaying the spinner until the API call returns the companies data
	//if (!heros) return <LoadingSpinner />;

	return (
		<>
			<h1>Search</h1>
			<SearchForm searchFor={search} />

			{heros && heros.length ? (
				<div className="Superherolist">
					{heros.map((h) => (
						<SearchCard
							name={h.name}
							id={h.id}
							imageUrl={h.image.url}
							intelligence={h.powerstats.intelligence}
							strength={h.powerstats.strength}
							speed={h.powerstats.speed}
							durability={h.powerstats.durability}
							power={h.powerstats.power}
							combat={h.powerstats.combat}
						/>
					))}
				</div>
			) : (
				<p className="lead">Sorry, no results were found!</p>
			)}
		</>
	);
}

export default Search;
