const router = require('express').Router();
const Controller = require('../controllers/auth');

router.route('/signup')
    .post(async (req, res, next) => {
        try {
            const result = await Controller.signup(req.body);
            res.status(201).send(result);
        } catch (err) {
            next(err);
        }
    });

router.route('/signin')
    .post(async (req, res, next) => {
        try {
            const tokens = await Controller.signin(req.body);
            res.status(200).json(tokens);
        } catch (err) {
            next(err);
        }
    });

router.route('/refreshToken')
    .post(async (req, res, next) => {
        try {
            const token = await Controller.refreshToken(req.body);
            res.status(200).json(token);
        } catch (err) {
            next(err);
        }
    });

module.exports = router;