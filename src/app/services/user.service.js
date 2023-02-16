const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const ApiError = require('../api-error');

class UserService {
    const;
    constructor(client) {
        this.User = client.db().collection('users');
    }

    extractUserData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            password: payload.password,
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async create(payload, next) {
        const user = this.extractUserData(payload);

        const u = await this.User.findOne({ email: user.email });
        if (u) {
            next(new ApiError(404, 'Email have been register'));
        }

        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        const hashPass = bcrypt.hashSync(user.password, salt);

        const newUser = await this.User.findOneAndUpdate(
            user,
            {
                $set: {
                    password: hashPass,
                    contact_list: [],
                    isAdmin: false,
                },
            },
            { returnDocument: 'after', upsert: true }
        );

        delete newUser.value.password;
        return newUser.value;
    }

    async addContact(contactId, userId) {
        return await this.User.updateOne(
            {
                _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
            },
            { $push: { contact_list: contactId.toString() } }
        );
    }

    async removeContact(contactId, userId) {
        return await this.User.updateOne(
            {
                _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
            },
            { $pull: { contact_list: contactId.toString() } }
        );
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByEmail(email) {
        return await this.User.findOne({
            email,
        });
    }

    async findByName(name) {
        return await this.User.find({
            name: { $regex: new RegExp(name), $options: 'i' },
        });
    }
}

module.exports = UserService;
