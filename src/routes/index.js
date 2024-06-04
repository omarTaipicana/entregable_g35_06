const express = require('express');
const userRouter = require('./user.router');
const cityRouter = require('./city.router');
const hotelRouter = require('./hotel.router');
const imageRouter = require('./image.router');
const bookingRouter = require('./booking.router');
const reviewRouter = require('./review.router');
const router = express.Router();

// colocar las rutas aquí
router.use(userRouter)
router.use(cityRouter)
router.use(hotelRouter)
router.use(imageRouter)
router.use(bookingRouter)
router.use(reviewRouter)


module.exports = router;