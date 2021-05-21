const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("./server");
const cleaner = require("knex-cleaner");
const jokes = require("./jokes/jokes-data");

const newUser = { username: "George", password: "Vinueza" };

beforeAll(async () => {
	await db.migrate.rollback();
	await db.migrate.latest();
});

beforeEach(async () => {
	await cleaner.clean(db, {
		ignoreTables: ["knex_migrations", "knex_migrations_lock"],
	});
});

afterAll(async () => {
	await db.destroy();
});

describe("[GET} /songs", () => {

  it("does not return jokes if not logged in", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.body).toMatchObject({message: "token required"})
  })

	it("returns a list of jokes if authenticated", async () => {
    let res = await request(server).post('/api/auth/register').send(newUser)
    res = await request(server).post('/api/auth/login').send(newUser)
		res = await request(server).get("/api/jokes").set({"Authorization": res.body.token});
		expect(res.body).toMatchObject(jokes);
	});
});

describe("[POST] /register", () => {

	it("creates a new user succesfully", async () => {
		let res = await request(server).post("/api/auth/register").send(newUser);
		expect(res.body).toHaveProperty("id");
		expect(res.body).toHaveProperty("username");
		expect(res.body).toHaveProperty("password");
	});

	it("does not register a user is username or password missing", async () => {
		let res = await request(server).post("/api/auth/register").send({ username: "Bob" });
		expect(res.body).toMatchObject({ message: "username and password required" });

		res = await request(server).post("/api/auth/register").send({ password: "Vance" });
		expect(res.body).toMatchObject({ message: "username and password required" });
	});

	it("does not create a user with an existing username", async () => {
		let res = await request(server).post("/api/auth/register").send(newUser);
		res = await request(server).post("/api/auth/register").send(newUser);
		expect(res.body).toMatchObject({ message: "username taken" });
	});
});

describe("[POST] /login", () => {

	it("logs a user in succesfully", async () => {
		let res = await request(server).post("/api/auth/register").send(newUser);
		res = await request(server).post("/api/auth/login").send(newUser);
		expect(res.body).toHaveProperty("message");
		expect(res.body).toHaveProperty("token");
	});

	it("does not login a user if username or password missing", async () => {
		let res = await request(server).post("/api/auth/login").send({ username: "Bob" });
		expect(res.body).toMatchObject({ message: "username and password required" });

		res = await request(server).post("/api/auth/register").send({ password: "Vance" });
		expect(res.body).toMatchObject({ message: "username and password required" });
	});

  it("does not login a user if username or password are incorrect", async () => {
    let res = await request(server).post("/api/auth/register").send(newUser);
    res = await request(server).post('/api/auth/login').send({username: "George", password: "Vance"})
    expect(res.body).toMatchObject({message: "invalid credentials"})
  })
});
