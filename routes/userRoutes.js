const express = require('express');

const usercontroller = require('./../controllers/usercontroller');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// these below routes need auth token
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', usercontroller.getMe, usercontroller.getUser);
router.patch(
    '/updateMe',
    usercontroller.uploadUserPhoto,
    usercontroller.resizeUserPhoto,
    usercontroller.updateMe
);
router.delete('/deleteMe', usercontroller.deleteMe);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(usercontroller.getAllUsers)
    .post(usercontroller.createUser);

router
    .route('/:id')
    .get(usercontroller.getUser)
    .patch(usercontroller.updateUser)
    .delete(usercontroller.deleteUser);

module.exports = router;
