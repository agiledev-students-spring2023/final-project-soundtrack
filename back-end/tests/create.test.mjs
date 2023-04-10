import request from "supertest";
import express from "express";
import accountsRouter from "../routes/Account.js";
import { expect } from 'chai';
import fs from 'fs';
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);


const app = express();
app.use(express.json());
app.use("/create", accountsRouter);

describe("Accounts API", () => {
  const usersFilePath = path.join(__dirname, "../routes/users.json");
  let existingUsers = [];

  before(async () => {
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath);
      existingUsers = JSON.parse(usersData);
      for (let user of existingUsers) {
        await request(app)
          .post("/create")
          .send(user);
      }
    }
  });

  afterEach(async () => {
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath);
      existingUsers = JSON.parse(usersData);

      // Delete the test user if it exists
      const testUserIndex = existingUsers.findIndex(user => user.username === "testuser");
      if (testUserIndex !== -1) {
        existingUsers.splice(testUserIndex, 1);
        fs.writeFileSync(usersFilePath, JSON.stringify(existingUsers));
      }
    }
  });

  it("GET /accounts should return a list of accounts", async () => {
    const response = await request(app).get("/create");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(existingUsers);
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
    const existingAccount = existingUsers[0];
    const response = await request(app).post("/create").send(existingAccount);
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal("Username already exists. Please choose a different username.");
  });

  after(() => {
    // Reset users.json to its original state
    fs.writeFileSync(usersFilePath, JSON.stringify(existingUsers));
  });
});
