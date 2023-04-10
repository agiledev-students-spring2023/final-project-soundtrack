import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

const expect = chai.expect;

chai.use(chaiHttp);

describe("POST /login", () => {
  it("should respond with a token if given a valid username and password", async () => {
    const res = await chai
      .request(app.listen()) // use app.listen() instead of app.address()
      .post("/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message").to.equal("Logged in successfully.");
    expect(res.body).to.have.property("token");
  });

  it("should respond with a 401 error if given an invalid username or password", async () => {
    const res = await chai
      .request(app.listen()) // use app.listen() instead of app.address()
      .post("/login")
      .send({ username: "invaliduser", password: "invalidpassword" });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property("error").to.equal("Invalid username or password.");
  });

  it("should respond with a 400 error if the request body is missing a username or password", async () => {
    const res = await chai
      .request(app.listen()) // use app.listen() instead of app.address()
      .post("/login")
      .send({});

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("error").to.equal("Username and password are required.");
  });
});
