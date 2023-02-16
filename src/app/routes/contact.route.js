const express = require('express');
const contacts = require('../controllers/contact.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router
    .route('/')
    .get(auth.userAuth, contacts.findAll)
    .post(auth.userAuth, contacts.create)
    .delete(auth.adminAuth, contacts.deleteAll);

router.route('/favorite').get(contacts.findAllFavorite);

router
    .route('/:id')
    .get(contacts.findOne)
    .put(auth.userAuth, contacts.update)
    .delete(auth.userAuth, contacts.delete);

module.exports = router;
