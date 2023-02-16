const jwt = require('jsonwebtoken');

const ApiError = require('../api-error');
const UserService = require('../services/user.service');
const MongoDB = require('../utils/mongodb.util');

exports.userAuth = async (req, res, next) => {
    if (!req.cookies.access_token) {
        return next(new ApiError(400, 'You need to login'));
    }

    try {
        jwt.verify(
            req.cookies.access_token,
            process.env.SECRET_JWT,
            function (err, decoded) {
                if (err) {
                    return next(new ApiError(404, 'Invalid access token'));
                }

                req.user = decoded;
                next();
            }
        );
    } catch (error) {
        console.log(error.message);
    }
};

exports.adminAuth = async (req, res, next) => {
    if (!req.cookies.access_token) {
        return next(new ApiError(400, 'You need to login'));
    }

    try {
        jwt.verify(
            req.cookies.access_token,
            process.env.SECRET_JWT,
            async function (err, decoded) {
                if (err) {
                    return next(new ApiError(404, 'Invalid access token'));
                }

                const userService = new UserService(MongoDB.client);
                const user = await userService.findById(decoded._id);

                if (!user.isAdmin) {
                    return next(
                        new ApiError(
                            403,
                            "You don't have permission to perform this action"
                        )
                    );
                }

                req.user = decoded;
                req.user.isAdmin = true;

                next();
            }
        );
    } catch (error) {
        console.log(error.message);
    }
};
