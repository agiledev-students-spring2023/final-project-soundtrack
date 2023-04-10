import request from "supertest";
import { app, close } from '../server.js';
import fs from "fs/promises";
import { expect } from 'chai';

import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const JWT_SECRET = "shaoxuewenlu";

describe('POST /', () => {
  let server;

  beforeEach(() => {
    server = app.listen(3000); // start the server for testing
  });

  afterEach(() => {
    server.close(); // close the server after testing
  });

  before(async () => {
    // Create a test user in users.json
    const testUser = {
      id: 1,
      username: "user1",
      password: "password1"
    };
    const usersFilePath = path.join(__dirname, "../routes/users.json");
    const usersData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(usersData);
    users.push(testUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users));
  });

  it('should respond with a token if given a valid username and password', async () => {
    const res = await request(server)
      .post('/')
      .send({ username: 'user1', password: 'password1' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.token).to.exist;
  });

  it('should respond with a 401 error if given an invalid username or password', async () => {
    const res = await request(server)
      .post('/')
      .send({ username: 'invalidUsername', password: 'invalidPassword' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);

      expect(res.body.error).to.equal('Invalid username or password.');

  });

  it('should respond with a 400 error if the request body is missing a username or password', async () => {
    const res = await request(server)
      .post('/')
      .send({ })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

      expect(res.body.error).to.equal('Username and password are required.');
  });

  after(() => {
    close(); // close the server after all tests have finished running
  });
  
});
