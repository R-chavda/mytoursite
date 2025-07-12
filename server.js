const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('uncaught exception **** shuting down....');
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('unhandled rejection **** shuting down....');
    server.close(() => {
        process.exit(1);
    });
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const path = require('path');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => {
    console.log('DB successfully connected');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`app runiing at ${port}`);
});
