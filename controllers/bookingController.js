const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
    const user = req.user;

    // 2) Mock checkout session (no Stripe)
    const session = {
        id: 'sess_mocked_123456',
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get(
            'host'
        )}/bookingCheckout/?tourId=${tour.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        // line_items: [
        //     {
        //         name: `${tour.name} Tour`,
        //         description: tour.summary,
        //         images: [
        //             `https://www.mytours.dev/img/tours/${tour.imageCover}`,
        //         ],
        //         amount: tour.price,
        //         currency: 'INR',
        //         quantity: 1,
        //     },
        // ],
        object: 'checkout.session',
        status: 'open',
    };
    // 3) Create session as response, include user, tour, price
    res.status(200).json({
        status: 'success',
        session,
        user,
        tour,
        price: tour.price,
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE
    const { tour, user, price } = req.query;
    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
