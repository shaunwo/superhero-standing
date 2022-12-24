'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
	NotFoundError,
	BadRequestError,
	UnauthorizedError,
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

/** Related functions for users. */

class User {
	/** authenticate user with username, password.
	 *
	 * Returns { username, first_name, last_name, email, is_admin }
	 *
	 * Throws UnauthorizedError is user not found or wrong password.
	 **/

	static async authenticate(username, password) {
		// try to find the user first
		const result = await db.query(
			`
			SELECT 
				user_id,
				username,
				password,
				first_name AS "firstName",
				last_name AS "lastName",
				email
	          FROM
				users
           	WHERE
				username = $1
			`,
			[username]
		);

		const user = result.rows[0];

		if (user) {
			// compare hashed password to a new hash from password
			const isValid = await bcrypt.compare(password, user.password);
			if (isValid === true) {
				delete user.password;
				return user;
			}
		}

		throw new UnauthorizedError('Invalid username/password');
	}

	/** Register user with data.
	 *
	 * Returns { username, firstName, lastName, email, isAdmin }
	 *
	 * Throws BadRequestError on duplicates.
	 **/

	static async register({ username, password, firstName, lastName, email }) {
		const duplicateCheck = await db.query(
			`SELECT username
           FROM users
           WHERE username = $1`,
			[username]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate username: ${username}`);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			BCRYPT_WORK_FACTOR
		);

		const result = await db.query(
			`INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
		  active)
           VALUES ($1, $2, $3, $4, $5, TRUE)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
			[username, hashedPassword, firstName, lastName, email]
		);

		const user = result.rows[0];

		return user;
	}

	/** Find all users.
	 *
	 * Returns [{ username, first_name, last_name, email, is_admin }, ...]
	 **/

	static async findAll() {
		const result = await db.query(
			`SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           ORDER BY username`
		);

		return result.rows;
	}

	/** Given a username, return data about user.
	 *
	 * Returns { username, first_name, last_name, is_admin, jobs }
	 *   where jobs is { id, title, company_handle, company_name, state }
	 *
	 * Throws NotFoundError if user not found.
	 **/

	static async get(username) {
		const userRes = await db.query(
			`
			SELECT 
				user_id,
				username,
				first_name AS "firstName",
				last_name AS "lastName",
				email,
				location,
				bio
           	FROM
				users
           	WHERE
				username = $1
			`,
			[username]
		);

		const user = userRes.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);

		// looking for this user's hero followings
		const userHeroFollowsRes = await db.query(
			`
			SELECT
				f.superhero_id
			FROM
			 	follows AS f
			WHERE
			 	f.user_id = $1
					AND
				f.active = TRUE
			 `,
			[user.user_id]
		);

		user.heroFollowedIds = userHeroFollowsRes.rows.map(
			(a) => a.superhero_id
		);

		// looking for this user's hero likes
		const userHeroLikesRes = await db.query(
			`
			SELECT
				l.superhero_id
			FROM
				likes AS l
			WHERE
				l.user_id = $1
					AND
				l.active = TRUE
			`,
			[user.user_id]
		);

		user.heroLikedIds = userHeroLikesRes.rows.map((b) => b.superhero_id);

		// looking for ALL users' hero followings
		const allUsersHeroFollowsRes = await db.query(
			`
			SELECT
				f.superhero_id,
				COUNT(*) AS superhero_follow_count
			FROM
			 	follows AS f
			WHERE
			 	f.active = TRUE
			GROUP BY
				superhero_id
			ORDER BY
				superhero_id ASC
			`
		);
		let heroAllUsersFollowedIds = {};
		for (let c = 0; c < allUsersHeroFollowsRes.rows.length; c++) {
			heroAllUsersFollowedIds[
				+allUsersHeroFollowsRes.rows[c].superhero_id
			] = +allUsersHeroFollowsRes.rows[c].superhero_follow_count;
		}
		user.heroAllUsersFollowedIds = heroAllUsersFollowedIds;

		// looking for ALL users' hero likes
		const allUsersHeroLikesRes = await db.query(
			`
			SELECT
				l.superhero_id,
				COUNT(*) AS superhero_like_count
			FROM
				likes AS l
			WHERE
				l.active = TRUE
			GROUP BY
				superhero_id
			ORDER BY
				superhero_id ASC
			`
		);
		let heroAllUsersLikedIds = {};
		for (let d = 0; d < allUsersHeroLikesRes.rows.length; d++) {
			heroAllUsersLikedIds[
				+allUsersHeroLikesRes.rows[d].superhero_id
			] = +allUsersHeroLikesRes.rows[d].superhero_like_count;
		}
		user.heroAllUsersLikedIds = heroAllUsersLikedIds;

		// looking for ALL users' hero comments
		const allUsersHeroCommentsRes = await db.query(
			`
					SELECT
						c.superhero_id,
						COUNT(*) AS superhero_comment_count
					FROM
						comments AS c
					WHERE
						c.active = TRUE
					GROUP BY
						superhero_id
					ORDER BY
						superhero_id ASC
					`
		);
		let heroAllUsersCommentsIds = {};
		for (let e = 0; e < allUsersHeroCommentsRes.rows.length; e++) {
			heroAllUsersCommentsIds[
				+allUsersHeroCommentsRes.rows[e].superhero_id
			] = +allUsersHeroCommentsRes.rows[e].superhero_comment_count;
		}
		user.heroAllUsersCommentsIds = heroAllUsersCommentsIds;

		// looking for this user's APPROVED mortal followings
		const userMortalFollowsRes = await db.query(
			`
			SELECT
				u.connectee_user_id
			FROM
			 	user_connections AS u
			WHERE
			 	u.connector_user_id = $1
					AND
				u.active=TRUE
			 `,
			[user.user_id]
		);

		user.mortalFollowedIds = userMortalFollowsRes.rows.map(
			(f) => f.connectee_user_id
		);

		// looking for this user's PENDING mortal followings
		const userPendingMortalFollowsRes = await db.query(
			`
			SELECT
				u.connectee_user_id
			FROM
			 	user_connections AS u
			WHERE
			 	u.connector_user_id = $1
					AND
				u.active=FALSE
			 `,
			[user.user_id]
		);

		user.pendingMortalFollowedIds = userPendingMortalFollowsRes.rows.map(
			(g) => g.connectee_user_id
		);

		return user;
	}

	static async getOther(id) {
		const userRes = await db.query(
			`
			SELECT 
				user_id,
				username,
				first_name AS "firstName",
				last_name AS "lastName",
				email,
				location,
				bio
           	FROM
				users
           	WHERE
				user_id = $1
			`,
			[id]
		);

		const user = userRes.rows[0];

		if (!user) throw new NotFoundError(`No user: ${id}`);

		// looking for this user's hero followings
		const userHeroFollowsRes = await db.query(
			`
			SELECT
				f.superhero_id
			FROM
			 	follows AS f
			WHERE
			 	f.user_id = $1
					AND
				f.active = TRUE
			 `,
			[user.user_id]
		);

		user.heroFollowedIds = userHeroFollowsRes.rows.map(
			(a) => a.superhero_id
		);

		// looking for this user's hero likes
		const userHeroLikesRes = await db.query(
			`
			SELECT
				l.superhero_id
			FROM
				likes AS l
			WHERE
				l.user_id = $1
					AND
				l.active = TRUE
			`,
			[user.user_id]
		);

		user.heroLikedIds = userHeroLikesRes.rows.map((b) => b.superhero_id);

		return user;
	}

	static async getRecentActivity(id) {
		const recentActivityRes = await db.query(
			`
			SELECT 
				*,
				to_char(created_dt, 'DD/MM/YYY') AS formated_created_dt
           	FROM
				recent_activity
           	WHERE
				user_id = $1
			ORDER BY
				created_dt DESC
			`,
			[id]
		);

		const recentActivity = recentActivityRes.rows;

		if (!recentActivity)
			throw new NotFoundError(`No recent actvity: ${id}`);

		return recentActivity;
	}
	/** Update user data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Data can include:
	 *   { firstName, lastName, password, email, isAdmin }
	 *
	 * Returns { username, firstName, lastName, email, isAdmin }
	 *
	 * Throws NotFoundError if not found.
	 *
	 * WARNING: this function can set a new password or make a user an admin.
	 * Callers of this function must be certain they have validated inputs to this
	 * or a serious security risks are opened.
	 */

	static async update(username, data) {
		if (data.password) {
			data.password = await bcrypt.hash(
				data.password,
				BCRYPT_WORK_FACTOR
			);
		}

		const { setCols, values } = sqlForPartialUpdate(data, {
			firstName: 'first_name',
			lastName: 'last_name',
		});
		const usernameVarIdx = '$' + (values.length + 1);

		const querySql = `UPDATE users 
                      SET ${setCols} 
				  , last_updated_dt=CURRENT_TIMESTAMP
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
						  location,
						  bio`;
		const result = await db.query(querySql, [...values, username]);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);

		delete user.password;
		return user;
	}

	/** Delete given user from database; returns undefined. */

	static async remove(username) {
		let result = await db.query(
			`DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
			[username]
		);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);
	}

	/* 
	FOLLOW / UNFOLLOW USER
	*/
	static async followUser(connector_user_id, connectee_user_id) {
		const userRes = await db.query(
			`
			INSERT INTO
				user_connections
					(connector_user_id,
					connectee_user_id,
					status,
					active)
			VALUES
				($1, $2, 0, FALSE)
			RETURNING
				connection_id
				`,
			[connector_user_id, connectee_user_id]
		);

		const user = userRes.rows[0];

		if (!user) throw new NotFoundError(`No user: ${connectee_user_id}`);
	}
	static async unfollowUser(connector_user_id, connectee_user_id) {
		const userRes = await db.query(
			`
			DELETE FROM
				user_connections
			WHERE
				connector_user_id=$1
					AND
				connectee_user_id=$2
			RETURNING
				connection_id
				`,
			[connector_user_id, connectee_user_id]
		);

		const user = userRes.rows[0];

		if (!user) throw new NotFoundError(`No user: ${connectee_user_id}`);
	}
}

module.exports = User;
