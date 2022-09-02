require('dotenv').config();

const get = (key) => process.env[key];

const SERVER_PORT = get('SERVER_PORT');
const CLIENT_PORT = get('CLIENT_PORT');

const DB_URL = get('DB_URL');
const JWT_ACCESS_SECRET = get('JWT_ACCESS_SECRET');
const JWT_REFRESH_SECRET = get('JWT_REFRESH_SECRET');

const SMTP_HOST = get('SMTP_HOST');
const SMTP_PORT = get('SMTP_PORT');
const SMTP_USER = get('SMTP_USER');
const SMTP_PASSWORD = get('SMTP_PASSWORD');

const CLIENT_URL = `${get('URL')}:${get('CLIENT_PORT')}`;
const SERVER_URL = `${get('URL')}:${get('SERVER_PORT')}/api`;
const API_URL = get('API_URL');

module.exports = {
    SERVER_PORT,
    CLIENT_PORT,
    DB_URL,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    CLIENT_URL,
    SERVER_URL,
    API_URL,
};
