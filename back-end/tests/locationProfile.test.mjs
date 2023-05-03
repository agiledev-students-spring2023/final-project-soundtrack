import { expect } from 'chai';
import express from "express";
import postRoute from "../routes/Post.js";
import fs from 'fs';
import path from "path";
import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app, close } from '../server.js';

chai.use(chaiHttp);

describe("GET /locationProfile/:locationID", () => {

  it("should return all public posts for a given locationID", (done) => {
    chai
      .request(app)
      .get("/locationProfile/locationID123")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body.posts).to.be.an("array");
        expect(res.body.posts.length).to.be.at.least(1);

        res.body.posts.forEach((post) => {
          expect(post).to.have.property("userId");
          expect(post).to.have.nested.property("songTitle.name");
          expect(post).to.have.nested.property("locationName.placeId", "locationID123");
          expect(post).to.have.property("privacy", "Public");
        });

        done();
      });
  });

  it("should return an error if the locationID is invalid", (done) => {
    chai
      .request(app)
      .get("/invalidLocationID")
      .end((err, res) => {
        expect(res).to.have.status(404);c
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error");

        done();
      });

  });
  after(async () => {
    // Clean up the test user
    await User.deleteOne({ userId: testUserId });

    // Close the server
    close();
  });
  
});
