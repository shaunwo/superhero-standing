'use strict';

/** Routes for users. */

//const jsonschema = require('jsonschema');

const express = require('express');

const router = express.Router();
const axios = require('axios');
//const https = require('https');
//const request = require('request');

router.get('/test', function() {
	// https://superheroapi.com/api/10160133913239144

	// axios method
	axios.get('https://superheroapi.com/api/10160133913239144')

		.then((response) => {
			console.log('I have a response!');
			console.log(response.data.url);
			console.log(response.data.explanation);
		})
		.catch((error) => {
			console.log(error);
		});

	/* // https method
          https.get(
		'https://superheroapi.com/api/10160133913239144/search/nightcrawler',
		(resp) => {
			let data = '';

			// A chunk of data has been received.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				console.log(JSON.parse(data).explanation);
			});
		}
	).on('error', (err) => {
		console.log('Error: ' + err.message);
	}); */

	/* request(
		'https://superheroapi.com/api/10160133913239144/search/nightcrawler',
		{ json: true },
		(err, res, body) => {
			if (err) {
				return console.log(err);
			}
			console.log(body.url);
			console.log(body.explanation);
		}
	); */
	console.log('hello??!');
});

module.exports = router;
