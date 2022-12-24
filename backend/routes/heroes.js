'use strict';

/** Routes for users. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureCorrectUserId, ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const Hero = require('../models/hero');
const { createToken } = require('../helpers/tokens');

const router = express.Router();

router.get(
	'/:userId/follow/hero/:heroId/:username/:superheroName',
	ensureCorrectUserId,
	async function(req, res, next) {
		try {
			const follow_id = await Hero.followHero(
				req.params.userId,
				req.params.username,
				req.params.heroId,
				req.params.superheroName
			);
			return res.json({ follow_id });
		} catch (err) {
			return next(err);
		}
	}
);
router.get(
	'/:userId/unfollow/hero/:heroId/:username/:superheroName',
	ensureCorrectUserId,
	async function(req, res, next) {
		try {
			console.log('Inside backend > routes > user.js: ');
			const follow_id = await Hero.unfollowHero(
				req.params.userId,
				req.params.username,
				req.params.heroId,
				req.params.superheroName
			);
			return res.json({ follow_id });
		} catch (err) {
			return next(err);
		}
	}
);

router.get(
	'/:userId/like/hero/:heroId/:username/:superheroName',
	ensureCorrectUserId,
	async function(req, res, next) {
		try {
			console.log('Inside backend > routes > user.js: ');
			const like_id = await Hero.likeHero(
				req.params.userId,
				req.params.username,
				req.params.heroId,
				req.params.superheroName
			);
			return res.json({ like_id });
		} catch (err) {
			return next(err);
		}
	}
);
router.get(
	'/:userId/unlike/hero/:heroId/:username/:superheroName',
	ensureCorrectUserId,
	async function(req, res, next) {
		try {
			console.log('Inside backend > routes > user.js: ');
			const like_id = await Hero.unlikeHero(
				req.params.userId,
				req.params.username,
				req.params.heroId,
				req.params.superheroName
			);
			return res.json({ like_id });
		} catch (err) {
			return next(err);
		}
	}
);

router.post(
	'/:userId/comment/hero/:heroId/:username/:superheroName',
	ensureCorrectUserId,
	async function(req, res, next) {
		try {
			const { comments } = req.body;
			const comment_id = await Hero.commentOnHero(
				req.params.userId,
				req.params.username,
				req.params.heroId,
				req.params.superheroName,
				comments
			);
			return res.json({ comment_id });
		} catch (err) {
			return next(err);
		}
	}
);
router.post(
	'/:userId/upload/hero/:heroId/:username/:superheroName',
	ensureCorrectUserId,
	async function(req, res, next) {
		try {
			const { upload } = req.body;
			const comment_id = await Hero.uploadHeroImage(
				req.params.userId,
				req.params.username,
				req.params.heroId,
				req.params.superheroName,
				upload
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
