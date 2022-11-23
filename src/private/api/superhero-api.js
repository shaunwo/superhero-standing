import axios from 'axios';

//const BASE_URL = 'https://www.superheroapi.com/api/10160133913239144';
const BASE_URL = 'http://localhost:3001/api';

class SuperheroApi {
	// the token for interactive with the API will be stored here.
	static token;

	static async request(endpoint, param, data = {}, method = 'get') {
		console.log('API Call:', endpoint, param, data, method);

		//there are multiple ways to pass an authorization token, this is how you pass it in the header.
		//this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
		//const url = `${BASE_URL}`;
		const url = `${BASE_URL}/${endpoint}/${encodeURIComponent(
			param.trim()
		)}`;
		console.log('URL for API call: ' + url);
		const headers = {
			'Access-Control-Allow-Origin': '*',
		};
		const params = method === 'get' ? data : {};

		try {
			console.log('in the try?');
			return await axios({ url, method, data, params, headers });
		} catch (err) {
			console.error('API Error:', err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// INDIVIDUAL API ROUTES

	// get listing of superheros - filtered by name if not undefined
	static async getHeros(name, data) {
		let res = await this.request(`search`, name, data, 'get');
		console.log('res:' + res);
		return res.heros;
	}
}

export default SuperheroApi;
