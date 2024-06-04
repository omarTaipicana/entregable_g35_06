const request = require("supertest");
const app = require("../app");
const City = require("../models/City");
const Hotel = require("../models/Hotel");

let id;
let token;
let userId;

beforeAll(async () => {
  const credentials = {
    email: "omar@hotmail.com",
    password: "omar12345",
  };
  const res = await request(app).post(`/users/login`).send(credentials);
  token = res.body.token;
  userId = res.body.user.id;
});

test("GET/bookings debe traer todos los Bookings", async () => {
  const res = await request(app)
    .get("/bookings")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST/bookings debe crear un booking", async () => {
  const city = await City.create({
    name: "Bogota",
    country: "Colombia",
    countryId: "CO",
  });
  const hotel = await Hotel.create({
    name: "Jimmys",
    description: "Hermoso hotel en la ciudad de Latacunga",
    price: 15.5,
    address: "Avenida amazonas",
    lat: -0.2344,
    lon: -78.2312,
    cityId: city.id,
  });

  const newBooking = {
    userId: userId,
    hotelId: hotel.id,
    checkIn: "2024-05-02",
    checkOut: "2024-05-02",
  };
  const res = await request(app)
    .post("/bookings")
    .send(newBooking)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  await city.destroy();
  await hotel.destroy();
  expect(res.status).toBe(201);
  expect(id).toBeDefined();
  expect(res.body.userId).toBe(userId);
});

test("GET/bookings/:id debe traer un booking segun su id", async () => {
  const res = await request(app)
    .get(`/bookings/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
});

test("PUT/bookings/:id debe actualizar un booking", async () => {
  const updateBooking = {
    checkIn: "2024-05-02",
  };
  const res = await request(app)
    .put(`/bookings/${id}`)
    .send(updateBooking)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(id).toBeDefined();
  expect(res.body.name).toBe(updateBooking.name);
});

test("DELETE/bookings/:id debe eliminar un booking", async () => {
  const res = await request(app)
    .delete(`/bookings/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
