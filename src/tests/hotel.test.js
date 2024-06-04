const request = require("supertest");
const app = require("../app");
const City = require("../models/City");

let id;
let token;

beforeAll(async () => {
  const credentials = {
    email: "omar@hotmail.com",
    password: "omar12345",
  };
  const res = await request(app).post(`/users/login`).send(credentials);
  token = res.body.token;
});

test("GET/hotels debe traer todos los Hoteles", async () => {
  const res = await request(app).get("/hotels");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST/hotels debe crear un hotel", async () => {
  const city = await City.create({
    name: "Bogota",
    country: "Colombia",
    countryId: "CO",
  });

  const newHotel = {
    name: "Jimmys",
    description: "Hermoso hotel en la ciudad de Latacunga",
    price: 15.5,
    address: "Avenida amazonas",
    lat: -0.2344,
    lon: -78.2312,
    cityId: city.id,
  };
  const res = await request(app)
    .post("/hotels")
    .send(newHotel)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  await city.destroy();
  expect(res.status).toBe(201);
  expect(id).toBeDefined();
  expect(res.body.name).toBe(newHotel.name);
});

test("GET/hotels/:id debe traer un hotel segun su id", async () => {
  const res = await request(app).get(`/hotels/${id}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
});

test("PUT/hotels/:id debe actualizar un hotel", async () => {
  const updateHotel = {
    name: "Jimmys updated",
  };
  const res = await request(app)
    .put(`/hotels/${id}`)
    .send(updateHotel)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(id).toBeDefined();
  expect(res.body.name).toBe(updateHotel.name);
});

test("DELETE/hotels/:id debe eliminar un hotel", async () => {
  const res = await request(app)
    .delete(`/hotels/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
