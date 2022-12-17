import React from 'react';
import SearchForm from './common/SearchForm';

function Home() {
	let search = '';
	return (
		<>
			<h1>Home</h1>
			<p>Coming soon... </p>
			<h2>Search for a Hero</h2>
			<SearchForm searchFor={search} />
		</>
	);
}

export default Home;
