const router = require('express').Router();
const {ObjectID} = require('mongodb');
const Controller = require('../controllers/messages');
const authenticate = require('../middleware/authenticateToken');

router.route('/')
    .get(authenticate, async(req, res, next) => {
        try {
            const result = await Controller.getMessages(req.query.page);
            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    })
    .post(authenticate, async(req, res, next) => {
        try {
            let query = {};
            if(req.user) {
                query.email = req.user.email;
            } else if (req.body.email) {
                query.email = req.body.email;
            } else {
                throw ({ message: 'Enter email' });
            }
            if(req.body.message && 0 < req.body.message.length <100 ) {
                query.message = req.body.message;
            } else {
                throw ({ message: 'Enter valid message' });
            }
            const result = await Controller.createMessage(query);
            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    });
router.route('/:id')
    .get(authenticate, async(req, res, next) => {
        try {
            if(req.params.id) {
                const result = await Controller.getMessage(req.params.id);
                res.status(200).send(result);
            } else {
                throw ({ status: 404, message: 'invalid Id' })
            }
        } catch (err) {
            next(err);
        }
    })
    .put(authenticate, async (req, res, next) => {
        try {
            if(req.params.id) {
                req.body.updateDate = Date.now(); console.log(req.body)
                const result = await Controller.updateMessage(req.params.id, req.body);
                res.status(200).send(result);
            } else {
                throw ({ status: 404, message: 'invalid Id' })
            }
        } catch (err) {
            next(err);
        }
    })
    .delete(authenticate, async (req, res, next) => {
        try {
            if(req.params.id) {
                const result = await Controller.deleteMessage(req.params.id);
                res.status(200).send('Deleted');
            } else {
                throw ({ status: 404, message: 'invalid Id' })
            }
        } catch(err) {
            next(err);
        }
    });
module.exports = router;