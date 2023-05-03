import express from 'express';
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import { app, close } from '../server.js';

chai.use(chaiHttp);
const expect = chai.expect;
const secretKey = process.env.JWT_SECRET_KEY;


describe('User registration', () => {
  // Connect to the database before the tests
  beforeEach(async () => {
    const userToDelete = await User.findOne({ userName: 'johndoe' });
    if (userToDelete) {
      await User.deleteOne({ userName: 'johndoe' });
    }
    const user = new User({
      firstName: 'Jane',
      userName: 'janedoe',
      password: 'password456',
      email: 'janedoe@example.com',
      spotifyUser: 'janedoe123',
      userId: 2
    });
    await user.save();
  });


  // Close the app after the tests
 
  // Test the POST route for creating a new user
  describe('POST /create', () => {
    it('should create a new user with valid credentials', async () => {
      const res = await chai.request(app)
        .post('/create')
        .send({
          name: 'John Doe',
          username: 'johndoe',
          password: 'password123',
          email: 'johndoe@example.com',
          spotify: 'johndoe123',
          id: 1
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'User created and logged in');
      expect(res.body).to.have.property('token');
      const decoded = jwt.verify(res.body.token, secretKey);
      expect(decoded).to.have.property('id', '1');
      const user = await User.findOne({ userName: 'johndoe' });
      expect(user).to.not.be.null;
      const match = await bcrypt.compare('password123', user.password);
      expect(match).to.be.true;
    });

    it('should not create a new user if the username already exists', async () => {
      const res = await chai.request(app)
        .post('/create')
        .send({
          name: 'John Doe',
          username: 'janedoe',
          password: 'password123',
          email: 'johndoe@example.com',
          spotify: 'johndoe123',
          id: 1
        });
      expect(res).to.have.status(409);
      expect(res.body).to.have.property('message', 'Username already exists');
      const user = await User.findOne({ userName: 'janedoe' });
      expect(user.password).to.equal('password456');
    });

    it('should return an error if there is a server-side issue', async () => {
      const errorMessage = 'Error saving user to database';
      const stub = sinon.stub(User.prototype, 'save').throws(new Error(errorMessage));
      const res = await chai.request(app)
        .post('/create')
        .send({
          name: 'John Doe',
          username: 'johndoe',
          password: 'password123',
          email: 'johndoe@example.com',
          spotify: 'johndoe123',
          id: 1
        });
      expect(res).to.have.status(500);
      expect(res.body).to.have.property('message', "Error saving user to database");
      stub.restore();
    });    
  });

  
  after(() => {
    close();
  });
  
});

