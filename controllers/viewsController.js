const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug })
        .populate({
            path: 'reviews',
            fields: 'review rating user',
        })
        .populate({
            path: 'guides',
            select: 'name photo role',
        });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign up for mytours',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser,
    });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    var bookings;
    if (req.user.id) {
        bookings = await Booking.find({ user: req.user.id });
    }
    if (!bookings) return new AppError('No bookings found', 404);
    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    return res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
});

exports.viewBookingCheckout = catchAsync(async (req, res, next) => {
    // Get booking info from query or session (mocked for now)
    const { tour: tourId, price } = req.query;

    if (!tourId || !price) {
        return res.status(400).render('bookingCheckout', {
            title: 'Booking your tour...',
            error: 'Missing booking information.',
        });
    }
    const tour = await Tour.findById(tourId);
    // Use
    res.status(200).render('bookingCheckout', {
        title: 'Booking your tour',
        tour,
        user: req.user,
        price,
    });
});
