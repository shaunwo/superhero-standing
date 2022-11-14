import React, { useState, useEffect } from 'react';
import SearchForm from './common/SearchForm';
import SuperheroApi from '../private/api/superhero-api';
import LoadingSpinner from './common/LoadingSpinner';

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
		//evt.preventDefault();
		console.log('Searching for: ' + name);
		let heros = await SuperheroApi.getHeros(name);
		setHeros(heros);
	}

	// displaying the spinner until the API call returns the companies data
	if (!heros) return <LoadingSpinner />;

	return (
		<>
			<h1>Search</h1>
			<SearchForm searchFor={search} />

			{/*heros.length ? (
				<div className="Superhero-list">
					{heros.map((h) => (
						<h1>{h.name}</h1>
					))}
				</div>
			) : (
				<p className="lead">Sorry, no results were found!</p>
			)*/}
		</>
	);
}

export default Search;
