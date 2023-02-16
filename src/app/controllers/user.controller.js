const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ApiError = require('../api-error');
const UserService = require('../services/user.service');
const ContactService = require('../services/contact.service');
const MongoDB = require('../utils/mongodb.util');

// Create and Save a new User
exports.create = async (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return next(new ApiError(400, 'Please fill out all field'));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body, next);

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while creating the user')
        );
    }
};

exports.login = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);

        const user = await userService.findByEmail(req.body.email);

        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return next(new ApiError(400, 'Email or password incorrect'));
        }

        const access_token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            process.env.SECRET_JWT,
            { expiresIn: '5h' }
        );

        if (access_token) res.cookie('access_token', access_token);

        return res.json({ access_token });
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while login'));
    }
};

// get all contacts by user id
exports.findAllContactsByUserId = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const contacts = await contactService.findAllByUserId(req.params.id);

        return res.json({ contacts });
    } catch (error) {
        return next(
            new ApiError(
                500,
                'An error occurred while find all contacts of user'
            )
        );
    }
};

// get favorite contacts by user id
exports.findFavoriteContactsByUserId = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const contacts = await contactService.findFavoriteByUserId(
            req.params.id
        );

        return res.json({ contacts });
    } catch (error) {
        return next(
            new ApiError(
                500,
                'An error occurred while find favorite contacts of user'
            )
        );
    }
};
