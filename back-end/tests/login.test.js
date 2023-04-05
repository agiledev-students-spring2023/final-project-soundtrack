const request = require("supertest");
const express = require("express");
const app = express();

const loginRouter = require("./routes/loginRouter");

app.use(express.json());
app.use("/loginCheck", loginRouter);

describe("POST /loginCheck", () => {
  test("It should return 401 if username and password are incorrect", async () => {
    const res = await request(app)
      .post("/loginCheck")
      .send({ username: "invalid_username", password: "invalid_password" });
    expect(res.statusCode).toEqual(401);
  });

  test("It should return 200 if username and password are correct", async () => {
    const res = await request(app)
      .post("/loginCheck")
      .send({ username: "valid_username", password: "valid_password" });
    expect(res.statusCode).toEqual(200);
  });
});
