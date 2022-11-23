'use strict';

/** Routes for external API calls */

//const jsonschema = require('jsonschema');

const express = require('express');

const router = express.Router();
const axios = require('axios');

router.get('/search/:searchFor', async function(req, res, next) {
	const searchFor = req.params.searchFor;

	console.log(
		'URL: ' +
			`https://www.superheroapi.com/api/10160133913239144/search/${searchFor}`
	);
	axios.get(
		`https://www.superheroapi.com/api/10160133913239144/search/${searchFor}`
	)
		.then((response) => {
			console.log(response.data.results);
			return response.data.results.json;
		})
		.catch((error) => {
			return error;
		});
});

module.exports = router;
