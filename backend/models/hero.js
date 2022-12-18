'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
	NotFoundError,
	BadRequestError,
	UnauthorizedError,
} = require('../expressError');

/** Related functions for heroes. */

class Hero {
	// follow/unfollow a hero
	static async followHero(userId, username, heroId, superheroName) {
		console.log('user_id: ' + userId);
		console.log('superhero_id: ' + heroId);
		const followRes = await db.query(
			`
			INSERT INTO
				follows
			(
				user_id,
				superhero_id,
				active
			)
			VALUES
				($1, $2, TRUE)
			RETURNING follow_id
			`,
			[userId, heroId]
		);
		console.log('SQL result in backend > models > user.js: ', followRes);
		const follow_id = followRes.rows[0];

		if (!follow_id) throw new NotFoundError(`No follow: ${heroId}`);

		// adding to activity log
		const followActivityRes = await db.query(
			`
          INSERT INTO
               recent_activity
          (
               user_id,
			username,
			superhero_id,
			superhero_name,
               description
          )
          VALUES
               ($1, $2, $3, $4, $5)
          RETURNING activity_id
          `,
			[userId, username, heroId, superheroName, 'liked']
		);
		const activity_id = followActivityRes.rows[0];

		if (!activity_id)
			throw new NotFoundError(`No follow activity: ${heroId}`);

		return follow_id;
	}

	static async unfollowHero(userId, heroId) {
		const unfollowRes = await db.query(
			`
			DELETE FROM
				follows
			WHERE
				user_id=$1
					AND
				superhero_id=$2
			RETURNING follow_id
		    `,
			[userId, heroId]
		);
		console.log(
			'SQL result in backend > models > user.js: ',
			unfollowRes
		);
		const follow_id = unfollowRes.rows[0];

		if (!follow_id) throw new NotFoundError(`No unfollow: ${heroId}`);

		const activityDescription = 'u|' + userId + ' unfollowed h|' + heroId;

		// adding to activity log
		const unfollowActivityRes = await db.query(
			`
          INSERT INTO
               recent_activity
          (
               user_id,
               description
          )
          VALUES
               ($1, $2)
          RETURNING activity_id
          `,
			[userId, activityDescription]
		);
		const activity_id = unfollowActivityRes.rows[0];

		if (!activity_id)
			throw new NotFoundError(`No unfollow activity: ${heroId}`);

		return follow_id;
	}

	// like/unlike a hero
	static async likeHero(userId, heroId) {
		const likeRes = await db.query(
			`
          INSERT INTO
               likes
          (
               user_id,
               superhero_id,
               active
          )
          VALUES
               ($1, $2, TRUE)
          RETURNING like_id
          `,
			[userId, heroId]
		);
		const like_id = likeRes.rows[0];

		if (!like_id) throw new NotFoundError(`No like: ${heroId}`);

		const activityDescription = 'u|' + userId + ' liked h|' + heroId;

		// adding to activity log
		const likeActivityRes = await db.query(
			`
          INSERT INTO
               recent_activity
          (
               user_id,
               description
          )
          VALUES
               ($1, $2)
          RETURNING activity_id
          `,
			[userId, activityDescription]
		);
		const activity_id = likeActivityRes.rows[0];

		if (!activity_id)
			throw new NotFoundError(`No like activity: ${heroId}`);

		return like_id;
	}
	static async unlikeHero(userId, heroId) {
		const likeRes = await db.query(
			`
          DELETE FROM
               likes
          WHERE
               user_id=$1
                    AND
               superhero_id=$2
          RETURNING like_id
         `,
			[userId, heroId]
		);
		console.log('SQL result in backend > models > user.js: ', likeRes);
		const like_id = likeRes.rows[0];

		if (!like_id) throw new NotFoundError(`No unlike: ${heroId}`);

		const activityDescription = 'u|' + userId + ' unliked h|' + heroId;

		// adding to activity log
		const unlikeActivityRes = await db.query(
			`
          INSERT INTO
               recent_activity
          (
               user_id,
               description
          )
          VALUES
               ($1, $2)
          RETURNING activity_id
          `,
			[userId, activityDescription]
		);
		const activity_id = unlikeActivityRes.rows[0];

		if (!activity_id)
			throw new NotFoundError(`No unlike activity: ${heroId}`);

		return like_id;
	}

	// comment on a hero
	static async commentOnHero(userId, heroId, comments) {
		const commentRes = await db.query(
			`
				INSERT INTO
					comments
				(
					user_id,
					superhero_id,
					comments,
					active
				)
				VALUES
					($1, $2, $3, TRUE)
				RETURNING comment_id
				`,
			[userId, heroId, comments]
		);
		console.log('SQL result in backend > models > user.js: ', commentRes);
		const comment_id = commentRes.rows[0];

		if (!comment_id) throw new NotFoundError(`No comment: ${heroId}`);

		const activityDescription =
			'u|' + userId + ' commented on h|' + heroId;

		// adding to activity log
		const commentActivityRes = await db.query(
			`
          INSERT INTO
               recent_activity
          (
               user_id,
               description
          )
          VALUES
               ($1, $2)
          RETURNING activity_id
          `,
			[userId, activityDescription]
		);
		const activity_id = commentActivityRes.rows[0];

		if (!activity_id)
			throw new NotFoundError(`No comment activity: ${heroId}`);

		return comment_id;
	}

	// pull comments for a hero
	static async heroComments(heroId) {
		const heroCommentRes = await db.query(
			`
				SELECT
					c.*,
					u.username
				FROM
					comments c
				JOIN
					users u ON c.user_id=u.user_id
				WHERE
					superhero_id=$1
						AND
					c.active=TRUE
						AND
					u.active=TRUE
				ORDER BY
					created_dt DESC
				`,
			[heroId]
		);
		console.log(
			'SQL result in backend > models > user.js: ',
			heroCommentRes
		);
		const comments = heroCommentRes.rows;
		return comments;
	}
}

module.exports = Hero;
