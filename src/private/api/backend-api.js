import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class BackendApi {
	// the token for interactive with the API will be stored here.
	static token;

	static async request(endpoint, data = {}, method = 'get') {
		console.log('API Call:', endpoint, data, method);

		//there are multiple ways to pass an authorization token, this is how you pass it in the header.
		//this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${BackendApi.token}` };
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

	// logging into site with username and password
	static async login(data) {
		let res = await this.request('auth/token', data, 'post');
		return res.token;
	}

	// signing up for new account on site
	static async signup(data) {
		let res = await this.request('auth/register', data, 'post');
		return res.token;
	}

	// getting the info on the current user
	static async getCurrentUser(username) {
		let res = await this.request(`users/${username}`);
		return res.user;
	}

	// updating the user profile
	static async saveProfile(username, data) {
		let res = await this.request(`users/${username}`, data, 'patch');
		return res.user;
	}

	// follow a hero
	static async followHero(userId, id, data) {
		console.log(
			'Inside static async followHero(userId, id, data) on backend-api.js'
		);
		let res = await this.request(
			`heroes/${userId}/follow/hero/${id}`,
			data,
			'get'
		);
		return res;
	}
	// unfollow a hero
	static async unfollowHero(userId, id, data) {
		console.log(
			'Inside static async unfollowHero(userId, id, data) on backend-api.js'
		);
		let res = await this.request(
			`heroes/${userId}/unfollow/hero/${id}`,
			data,
			'get'
		);
		return res;
	}
	// like a hero
	static async likeHero(userId, id, data) {
		console.log(
			'Inside static async likeHero(userId, id, data) on backend-api.js'
		);
		let res = await this.request(
			`heroes/${userId}/like/hero/${id}`,
			data,
			'get'
		);
		return res;
	}
	// unlike a hero
	static async unlikeHero(userId, id, data) {
		console.log(
			'Inside static async unlikeHero(userId, id, data) on backend-api.js'
		);
		let res = await this.request(
			`heroes/${userId}/unlike/hero/${id}`,
			data,
			'get'
		);
		return res;
	}
	// comment on a hero
	static async commentOnHero(userId, id, data) {
		console.log(
			'Inside static async commentOnHero(userId, id, data) on backend-api.js'
		);
		console.log('data: ', data);
		let res = await this.request(
			`heroes/${userId}/comment/hero/${id}`,
			data,
			'post'
		);
		return res;
	}
}

export default BackendApi;
