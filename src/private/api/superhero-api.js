import axios from 'axios';

const BASE_URL = 'https://superheroapi.com/api/10160133913239144';

class SuperheroApi {
	// the token for interactive with the API will be stored here.
	static token;

	static async request(endpoint, data = {}, method = 'get') {
		console.debug('API Call:', endpoint, data, method);

		//there are multiple ways to pass an authorization token, this is how you pass it in the header.
		//this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
		const url = `${BASE_URL}/${endpoint}`;
		console.log('URL for API call:' + url);
		const headers = {
			'Access-Control-Allow-Origin': '*',
		};
		const params = method === 'get' ? data : {};

		try {
			return (await axios({ url, method, data, params, headers }))
				.data;
		} catch (err) {
			console.error('API Error:', err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// INDIVIDUAL API ROUTES

	// get listing of superheros - filtered by name if not undefined
	static async getHeros(name, data) {
		let res = await this.request(`search/${name}`, data, 'get');
		console.log('res:' + res);
		return res.heros;
	}
}

export default SuperheroApi;
