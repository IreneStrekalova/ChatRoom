require('dotenv').config();
const emailRegex = require('email-regex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const RefreshToken = require('../models/refreshToken');
const authHelper = require('../helpers/auth');

module.exports = {
    async signup(body) {
        let valid = emailRegex({exact: true}).test(body.email);
        if (!valid) {
            throw ({ status: 404, message: 'invalid email' });
        }
        let isUser = await User.findOne({ login: body.login}).exec();
        if (isUser) {
            throw ({ status: 409, message: 'this login is used' });
        }
        isUser = await User.findOne({ email: body.email}).exec();
        if (isUser) {
            throw ({ status: 409, message: 'this email is used' });
        }
        return await this.createUser(body);
    },

    async signin(body) {
        let isUser = await User.findOne({ login: body.login }).exec();
        if (!isUser) {
            throw ({ status: 404, message: 'user not exist' });
        }
        const passwResult = bcrypt.compareSync(body.password.trim(), isUser.password);
        if (!passwResult) {
            throw ({ status: 404, message: 'wrong password' });
        }
        const accessToken = authHelper.generateAccessToken(isUser.toJSON());
        const refreshToken = authHelper.generateRefreshToken(isUser.toJSON());
        this.saveAccessToken(isUser._id, accessToken);
        this.saveRefreshToken(isUser._id, refreshToken);
        return tokens = {
            accessToken: `Bearer ${accessToken}`,
            refreshToken: refreshToken
        }
    },

    async refreshToken(body) {
        const refreshToken = body.token;
        if (!refreshToken || !refreshToken.includes(refreshToken)) {
            throw ({ status: 404, message: 'refresh token not found' });
        }
        try {
            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const token = authHelper.generateAccessToken(
                { id: user.id,
                  login: user.login,
                  email: user.email
                });
            this.saveRefreshToken(user.id, `Bearer ${token}`);
            return `Bearer ${token}`;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw ({ message: 'Token expired' });
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw ({ message: 'Token invalid' });
            }
        }
    },

    async createUser(body) {
        const salt = bcrypt.genSaltSync(10);
        const passw = bcrypt.hashSync(body.password.trim(), salt);

        return await User.create({
            login: body.login,
            email: body.email.trim().toLowerCase(),
            password: passw
        });
    },

    async saveAccessToken(userId, token) {
        const isToken = await AccessToken.findOne({ userId: userId }).exec();
        let result;
        if(isToken) {
            result = await AccessToken.findByIdAndUpdate(isToken._id, { token: token }).exec();
        } else {
            result = await AccessToken.create({
                userId: userId,
                token: token
            });
        }
        return result;
    },

    async saveRefreshToken(userId, token) {
        const isToken = await RefreshToken.findOne({ userId: userId }).exec();
        let result;
        if(isToken) {
            result = await RefreshToken.findByIdAndUpdate(isToken._id, { token: token });
        } else {
            result = await RefreshToken.create({
                userId: userId,
                token: token
            });
        }
        return result;
    }
}