const Hotel = require("./Hotel");
const City = require("./City");
const Image = require("./Image");
const User = require("./User");
const Booking = require("./Booking");
const Review = require("./Review");


City.hasMany(Hotel)
Hotel.belongsTo(City)

Hotel.hasMany(Image)
Image.belongsTo(Hotel)

User.hasMany(Booking)
Booking.belongsTo(User)

Hotel.hasMany(Booking)
Booking.belongsTo(Hotel)

Hotel.hasMany(Review)
Review.belongsTo(Hotel)

User.hasMany(Review)
Review.belongsTo(User)