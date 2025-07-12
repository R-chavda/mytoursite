const express = require('express');
const morgan = require('morgan');
const { dirname } = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const reviewRouter = require(`${__dirname}/routes/reviewRoutes`);
const bookingRouter = require(`${__dirname}/routes/bookingRoutes`);
const viewRouter = require(`${__dirname}/routes/viewRoutes`);

const app = express();

// global middlewares

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

//serving static files
app.use(express.static(`${__dirname}/public`));

//dev logging via env
if (process.env.NODE_ENV === 'development') {
    // app.use(morgan('dev'));
}

// limiting reqests from this api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// body parser into json , limiting size of req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//xss-clean is deprecated
//npm install dompurify jsdom
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);
app.use(compression());
// adding test label for use
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
