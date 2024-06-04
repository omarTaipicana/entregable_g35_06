const request = require("supertest");
const app = require("../app");

let id;
let token;

test("POST/users debe crear un usuario", async () => {
  const newUser = {
    firstName: "Fernando",
    lastName: "Taipi",
    email: "fernandoparadoja@hotmail.com",
    password: "fer12345",
    gender: "male",
  };
  const res = await request(app).post("/users").send(newUser);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(id).toBeDefined();
  expect(res.body.firstName).toBe(newUser.firstName);
});

test("POST/users/login debe logguear al usuario ", async () => {
  const credentials = {
    email: "fernandoparadoja@hotmail.com",
    password: "fer12345",
  };
  const res = await request(app).post(`/users/login`).send(credentials);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(token).toBeDefined();
  expect(res.body.user.email).toBe(credentials.email);
});

test("GET/users debe traer todos los usuarios", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("GET/users/:id debe traer un usuario segun su id", async () => {
  const res = await request(app)
    .get(`/users/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Object);
});

test("PUT/users/:id debe actualizar un usuario", async () => {
  const updateUser = {
    firstName: "Omar updated",
  };
  const res = await request(app)
    .put(`/users/${id}`)
    .send(updateUser)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(id).toBeDefined();
  expect(res.body.firstName).toBe(updateUser.firstName);
});

test("POST/users/login con credenciales incorrecvtas debe dar error", async () => {
  const credentials = {
    email: "fernan@hotmail.com",
    password: "12345",
  };
  const res = await request(app).post(`/users/login`).send(credentials);
  expect(res.status).toBe(401);
  expect(res.body.mesagge).toBe("Invalid user");
});

test("DELETE/users/:id debe eliminar un usuario", async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
