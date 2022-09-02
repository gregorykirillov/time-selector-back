const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const router = require('./router/index');

const { SERVER_PORT, DB_URL, CLIENT_URL } = require('./settings');
const errorMiddleware = require('./middleware/error-middleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: CLIENT_URL,
    }),
);
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(SERVER_PORT, () => console.log(`Started on ${SERVER_PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
