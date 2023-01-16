const bcrypt = require("bcrypt");
const {CustomError} = require("../error/CustomError");
const jwt = require("jsonwebtoken");
const {ACCESS_SECRET, REFRESH_SECRET} = require("../config/config");
module.exports = {

    hashPassword: (password) => bcrypt.hash(password, 10),

    comparePassword: async (hashPassword, password) => {
        const isPasswordSame = await bcrypt.compare(password, hashPassword);

        if (!isPasswordSame) {
            throw new CustomError ('Wrong password', 401);
        }
    },

    generateAccessTokenPair: (dataToSign = {}) => {
        const accessToken = jwt.sign(dataToSign, ACCESS_SECRET, {expiresIn: '10m'});
        const refreshToken = jwt.sign(dataToSign, REFRESH_SECRET, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    },

    checkTokens: (token = '', tokenType = 'accessToken') => {
        try {
            let secret = '';

            if (tokenType === 'accessToken') secret = ACCESS_SECRET;
            else if (tokenType === 'refreshToken') secret = REFRESH_SECRET;

            return jwt.verify(token, secret);

        } catch (e) {
            throw new CustomError('Token not valid', 401)
        }
    }
}