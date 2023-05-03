import { expect } from 'chai';
import express from "express";
import postRoute from "../routes/Post.js";
import fs from 'fs';
import path from "path";
import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';

//const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
app.use(express.json());
app.use("/post", postRoute);
chai.use(chaiHttp);

describe('POST /savePost', () => {
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
        .post('/savePost')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('Missing token header');
          done();
        });
    });
  
    it('should return a 403 status code if token is invalid', (done) => {
      chai.request(app)
        .post('/savePost')
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
        .post('/savePost')
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.equal('testuser has successfully created a post');
          done();
        });
    });
  });
  it('should return a 403 status code if the request body is invalid', (done) => {
    const invalidPost = {
      // incomplete post object, missing required fields
      songTitle: "qiangxinji",
      imageURL: "qiangxinji",
      privacy: "private",
      userId: "1111",
      userName: "yeyenainaiqinghehao"
    };
    const token = jwt.sign({ username: 'testuser', userId: 123 }, JWT_SECRET);
    chai.request(app)
      .post('/savePost')
      .set('Authorization', 'Bearer ' + token)
      .send(invalidPost)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.text).to.equal('Invalid post data');
        done();
      });
  });

  it('should return a 200 status code and the saved post data if the request body is valid', (done) => {
    const validPost = {
      songTitle: "qiangxinji",
      imageURL: "qiangxinji",
      locationName: "shaoxuewenlu",
      privacy: "private",
      userId: "1111",
      userName: "yeyenainaiqinghehao"
    };
    const token = jwt.sign({ username: 'testuser', userId: 123 }, JWT_SECRET);
    chai.request(app)
      .post('/savePost')
      .set('Authorization', 'Bearer ' + token)
      .send(validPost)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(validPost); // check that the returned post data matches the sent data
        done();
      });
  });

  