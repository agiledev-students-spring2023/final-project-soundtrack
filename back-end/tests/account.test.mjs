import request from "supertest";
import express from "express";
import accountsRouter from "../routes/Account.js";
import { expect } from 'chai';

const app = express();
app.use(express.json());
app.use("/create", accountsRouter);

describe("Accounts API", () => {
  before(async () => {
    await request(app)
      .post("/create")
      .send({
        username: "isaB",
        password: "bella",
        name: "isa",
        email: "icm268@nyu.edu",
        spotify: "be"
      });
  });

  it("GET /accounts should return a list of accounts", async () => {
    const response = await request(app).get("/create");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([
      {
        username: "isaB",
        password: "bella",
        name: "isa",
        email: "icm268@nyu.edu",
        spotify: "be"
      }
    ]);
  });

  it("POST /accounts/create should create a new account", async () => {
    const newAccount = {
      username: "testuser",
      password: "testpassword"
    };
    const response = await request(app).post("/create").send(newAccount);
    expect(response.status).to.equal(201);
  });

  it("POST /create should return an error if username already exists", async () => {
    const existingAccount = {
      username: "isaB",
      password: "bella",
      name: "isa",
      email: "icm268@nyu.edu",
      spotify: "be"
    };
    const response = await request(app).post("/create").send(existingAccount);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal("Username already exists. Please choose a different username.");
  });
});
