import { expect } from 'chai';
import express from "express";
import friendsRoute from "../routes/Friends.js";
import fs from 'fs';
import path from "path";
import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';

const app = express();
app.use(express.json());
app.use("/Friends", friendsRoute);
chai.use(chaiHttp);

describe('POST /newfriendrequest', () => {
  const JWT_SECRET = "shaoxuewenlu";
  let server;

  beforeEach(() => {
    server = app.listen(3000); // start the server for testing
  });

  afterEach(() => {
    server.close(); // close the server after testing
  });

    it('should return a 401 status code if token header is missing', (done) => {
      chai.request(app)
        .post('/newfriendrequest')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('Missing token header');
          done();
        });
    });
  
    it('should return a 403 status code if token is invalid', (done) => {
      chai.request(app)
        .post('/newfriendrequest')
        .set('Authorization', 'Bearer invalidToken')
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.text).to.equal('Invalid token');
          done();
        });
    });
  
    it('should call next() if token is valid', (done) => {
      // Mock a valid JWT token for a user with username "testuser" and ID 123
      const token = jwt.sign({ username: 'testuser', userId: 123 }, JWT_SECRET);
      chai.request(app)
        .post('/newfriendrequest')
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
