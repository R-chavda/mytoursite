const express = require('express');
const tourcontroller = require('./../controllers/tourcontroller');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourcontroller.checkId)

router.use('/:tourId/reviews', reviewRouter);
router
    .route('/top-5-cheap')
    .get(tourcontroller.aliasTopTours, tourcontroller.getAllTours);

router.route('/tour-stats').get(tourcontroller.getTourStats);
router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourcontroller.getMonthlyPlan
    );

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourcontroller.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourcontroller.getDistances);

router
    .route('/')
    .get(tourcontroller.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourcontroller.createTour
    );

router
    .route('/:id')
    .get(tourcontroller.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourcontroller.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourcontroller.deleteTour
    );

module.exports = router;
