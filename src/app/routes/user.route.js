const express = require('express');
const users = require('../controllers/user.controller');
const contacts = require('../controllers/contact.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router
    .route('/')
    // .get(contacts.findAll)
    .post(users.create);
// .delete(contacts.deleteAll);

// router.route("/favorite").get(contacts.findAllFavorite);

router.get('/:id/contacts', auth.userAuth, users.findAllContactsByUserId);
router.get(
    '/:id/contacts/favorite',
    auth.userAuth,
    users.findFavoriteContactsByUserId
);

module.exports = router;
