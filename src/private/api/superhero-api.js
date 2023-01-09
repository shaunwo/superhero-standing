import axios from 'axios';

const BE_API_URL = process.env.BE_API_URL || 'http://localhost:3001/api';

class SuperheroApi {
	// the token for interactive with the API will be stored here.
	static token;

	static async request(endpoint, param, data = {}, method = 'get') {
		console.log('API Call endpoint: ' + endpoint);
		console.log('API Call param: ' + param);
		//there are multiple ways to pass an authorization token, this is how you pass it in the header.
		//this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
		const url = `${BE_API_URL}${endpoint}/${encodeURIComponent(param)}`;
		console.log('URL for API call: ' + url);
		const headers = {
			'Access-Control-Allow-Origin': '*',
		};
		const params = method === 'get' ? data : {};

		try {
			return await axios({ url, method, data, params, headers });
		} catch (err) {
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// INDIVIDUAL API ROUTES

	// get listing of superheroes - filtered by name if not undefined
	static async getHeros(name, data) {
		let res = await this.request(`/search`, name, data, 'get');
		return res;
	}

	// get details of individual superhero - filtered by name if not undefined
	static async getHero(id, data) {
		let res = await this.request('/hero', id, data, 'get');
		return res;
	}
}

export default SuperheroApi;
