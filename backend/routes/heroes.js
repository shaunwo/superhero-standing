'use strict';

/** Routes for users. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureCorrectUserId, ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const Hero = require('../models/hero');
const { createToken } = require('../helpers/tokens');

const router = express.Router();

router.get('/:userId/follow/hero/:heroId', ensureCorrectUserId, async function(
	req,
	res,
	next
) {
	console.log(
		'Inside backend > routes > user.js: ... /:userId/follow/hero/:heroId'
	);
	try {
		console.log('Inside backend > routes > user.js: ');
		const follow_id = await Hero.followHero(
			req.params.userId,
			req.params.heroId
		);
		return res.json({ follow_id });
	} catch (err) {
		return next(err);
	}
});
router.get(
	'/:userId/unfollow/hero/:heroId',
	ensureCorrectUserId,
	async function(req, res, next) {
		console.log(
			'Inside backend > routes > user.js: ... /:userId/unfollow/hero/:heroId'
		);
		try {
			console.log('Inside backend > routes > user.js: ');
			const follow_id = await Hero.unfollowHero(
				req.params.userId,
				req.params.heroId
			);
			return res.json({ follow_id });
		} catch (err) {
			return next(err);
		}
	}
);

router.get('/:userId/like/hero/:heroId', ensureCorrectUserId, async function(
	req,
	res,
	next
) {
	console.log(
		'Inside backend > routes > user.js: ... /:userId/like/hero/:heroId'
	);
	try {
		console.log('Inside backend > routes > user.js: ');
		const like_id = await Hero.likeHero(
			req.params.userId,
			req.params.heroId
		);
		return res.json({ like_id });
	} catch (err) {
		return next(err);
	}
});
router.get('/:userId/unlike/hero/:heroId', ensureCorrectUserId, async function(
	req,
	res,
	next
) {
	console.log(
		'Inside backend > routes > user.js: ... /:userId/unlike/hero/:heroId'
	);
	try {
		console.log('Inside backend > routes > user.js: ');
		const like_id = await Hero.unlikeHero(
			req.params.userId,
			req.params.heroId
		);
		return res.json({ like_id });
	} catch (err) {
		return next(err);
	}
});

router.post(
	'/:userId/comment/hero/:heroId',
	ensureCorrectUserId,
	async function(req, res, next) {
		console.log(
			'Inside backend > routes > user.js: ... /:userId/comment/hero/:heroId'
		);
		try {
			console.log('Inside backend > routes > user.js: ');
			const { comments } = req.body;
			console.log('comments: ', comments);
			const comment_id = await Hero.commentOnHero(
				req.params.userId,
				req.params.heroId,
				comments
			);
			return res.json({ comment_id });
		} catch (err) {
			return next(err);
		}
	}
);

router.get('/comments/:heroId', ensureLoggedIn, async function(req, res, next) {
	console.log('Inside backend > routes > heroes.js: ... /comments/:heroId');
	try {
		console.log('Inside backend > routes > user.js: ');
		const { comments } = req.body;
		console.log('comments: ', comments);
		const commentOnHero = await Hero.heroComments(req.params.heroId);
		return res.json(commentOnHero);
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
