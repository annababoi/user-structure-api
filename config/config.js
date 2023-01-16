const dotenv = require('dotenv').config().parsed;

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URL:  process.env.MONGO_URL,

    ACCESS_SECRET: process.env.ACCESS_SECRET || 'SECRET_ACC',
    REFRESH_SECRET: process.env.REFRESH_SECRET || 'SECRET_REF'
}