import React, { useState } from 'react';
import './SearchForm.css';

/** Search widget.
 *
 * Appears on CompanyList and JobList so that these can be filtered
 * down.
 *
 * This component doesn't *do* the searching, but it renders the search
 * form and calls the `searchFor` function prop that runs in a parent to do the
 * searching.
 *
 * { CompanyList, JobList } -> SearchForm
 */

function SearchForm({ searchFor }) {
	console.debug('SearchForm', 'searchFor=', typeof searchFor);

	// setting search in state
	const [searchTerm, setSearchTerm] = useState('');

	// sending the search up to the parent component
	function handleSubmit(evt) {
		// take care of accidentally trying to search for just spaces
		evt.preventDefault();
		console.log('searchTerm: ' + searchTerm.trim());
		searchFor(searchTerm.trim() || undefined);
		setSearchTerm(searchTerm.trim());
	}

	// updating the search form field
	function handleChange(evt) {
		setSearchTerm(evt.target.value);
	}

	// displaying the search form on the screen
	return (
		<div className="SearchForm mb-4">
			<form
				action="/search"
				className="form-inline"
				onSubmit={handleSubmit}
			>
				<input
					className="form-control form-control-lg flex-grow-1"
					name="searchTerm"
					placeholder="Enter something to search for..."
					value={searchTerm}
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="btn btn-lg btn-primary"
					onSubmit={handleSubmit}
				>
					Submit
				</button>
			</form>
		</div>
	);
}

export default SearchForm;
