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

test("GET/reviews debe traer todos los Reviews", async () => {
  const res = await request(app).get("/reviews");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST/reviews debe crear un review", async () => {
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

  const newReview = {
    userId: userId,
    hotelId: hotel.id,
    rating: 5,
    comment: "comentario del hotel",
  };
  const res = await request(app)
    .post("/reviews")
    .send(newReview)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  await city.destroy();
  await hotel.destroy();
  expect(res.status).toBe(201);
  expect(id).toBeDefined();
  expect(res.body.userId).toBe(userId);
});

test("GET/reviews/:id debe traer un review segun su id", async () => {
  const res = await request(app)
    .get(`/reviews/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
});

test("PUT/reviews/:id debe actualizar un review", async () => {
  const updateReview = {
    comment: "comentario del hotel actualizado",
  };
  const res = await request(app)
    .put(`/reviews/${id}`)
    .send(updateReview)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(id).toBeDefined();
  expect(res.body.name).toBe(updateReview.name);
});

test("DELETE/reviews/:id debe eliminar un review", async () => {
  const res = await request(app)
    .delete(`/reviews/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
