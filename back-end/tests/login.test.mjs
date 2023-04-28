import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import jest from 'jest';

import { app, close } from '../server.js';
const hashedPassword = await bcrypt.hash('password456', 10);



describe('POST /', () => {
  const testUser = {
    username: 'loginTest',
    password: 'password456'
  };
  
  let token;

  beforeEach(async () => {
    const userToDelete = await User.findOne({ userName:testUser.username });
    if (userToDelete) {
      await User.deleteOne({  userName:testUser.username });
    }
    const user = new User({
      firstName: 'Jane',
      userName: testUser.username,
      password: hashedPassword,
      email: 'janedoe@example.com',
      spotifyUser: 'janedoe123',
      userId: 2
    });
    await user.save();
  });

  it('should return 200 and a JWT token when valid username and password are provided', async () => {
    const response = await request(app)
      .post('/')
      .send(testUser);

    expect(response.status).to.equal(200);
    expect(response.body.token).to.exist;
    token = response.body.token;
  });

  it('should set a HTTP-only cookie with the JWT token when valid username and password are provided', async () => {
    const response = await request(app)
      .post('/')
      .send(testUser);

    expect(response.status).to.equal(200);
    expect(response.headers['set-cookie']).to.exist;

    expect(response.headers['set-cookie'][0]).to.contain(`token=${token}`);
    expect(response.headers['set-cookie'][0]).to.contain('HttpOnly');
  });

  it('should return 401 when an invalid username is provided', async () => {
    const response = await request(app)
      .post('/')
      .send({
        username: 'nonexistentuser',
        password: 'password123'
      });

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Invalid username or password');
  });

  it('should return 401 when an invalid password is provided', async () => {
    const response = await request(app)
      .post('/')
      .send({
        username: testUser.userName,
        password: 'wrongpassword'
      });

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Invalid username or password');
  });

  
  const secretKey = "shaoxuewenlu";

  it('should return a JWT token with the correct payload', async () => {
    const response = await request(app)
      .post('/')
      .send(testUser);

    expect(response.status).to.equal(200);
    const decoded = jwt.verify(response.body.token, secretKey);
    expect(decoded.id).to.exist;
  });

   after(() => {
    close();
  });
});
