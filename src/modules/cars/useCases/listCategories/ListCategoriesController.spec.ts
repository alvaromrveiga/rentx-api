import { hash } from "bcrypt";
import request from "supertest"; // eslint-disable-line 
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("List Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("adminPa$$w0rd", 10);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES ('${id}', 'admin','admin@rentx.com.br', '${password}', true, 'XXXXXX', 'now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should list all categories", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "adminPa$$w0rd",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "Category test",
        description: "Category test description",
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category test");
  });

  it("Should not create a category with name already in use", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "adminPa$$w0rd",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        name: "Category test",
        description: "Category test description",
      });

    expect(response.status).toBe(400);
  });
});
