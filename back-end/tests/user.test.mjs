import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import path from 'path';
import { app, close } from '../server.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

describe('GET /user', () => {
  let token;
  let testUserId;

  before(async () => {
    // Create a test user and save it to the database
    const testUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johnDoe123',
      email: 'johndoe@example.com',
      spotifyUser: 'johndoe123',
      password: 'password123', // Assuming this is a hashed password
      avatar: 'https://example.com/avatar.jpg',
      userId: 1,
      privacy: false,
    });

    await testUser.save();

    // Generate a JWT token for the test user
    const secretKey = process.env.JWT_SECRET_KEY;
    token = jwt.sign({ id: testUser.userId }, secretKey);

    testUserId = testUser.userId;
  });

  it('should return 200 and user info when a valid token is provided', async () => {
    const response = await request(app)
      .get('/user/userInfo')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).to.equal(200);
    expect(response.body.userName).to.equal('johnDoe123');
    expect(response.body.avatar).to.equal('https://example.com/avatar.jpg');
    expect(response.body.userId).to.equal(testUserId);
  });

  it('should return the user info when GET /user/getUserInfo/:userId is called with a valid userId', async () => {
  
    const response = await request(app)
      .get(`/user/getUserInfo/${testUserId}`);
  
    expect(response.status).to.equal(200);
    expect(response.body.userName).to.equal('johnDoe123');
    expect(response.body.avatar).to.equal('https://example.com/avatar.jpg');
  });
  
  it('should return an empty list when GET /user is called with a valid token but there are no posts for the user', async () => {
    // Create a new user with no posts
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).to.equal(200);
    expect(response.body.posts).to.be.an('array').with.length(0);
  });

  it('should return a list of posts when GET /user is called with a valid token', async () => {
    // Get the user ID based on the username
    const user = await User.findOne({ userName: 'kokomi' });
    const userId = user.userId;
  
    // Make the request using the user's ID
    const response = await request(app)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).to.equal(200);
    expect(response.body.posts).to.be.an('array').with.length.greaterThan(0);
  });
  
  it('should return a list of public posts when GET /user/:userId is called with a valid userId and privacy is set to public', async () => {
    const user = await User.findOne({ userName: 'kokomi' });
    const testUserId = user.userId;
    const response = await request(app)
      .get(`/user/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).to.equal(200);
    expect(response.body.posts).to.be.an('array').with.length.greaterThan(0);
  
    // Check that all posts have privacy set to "Public"
    response.body.posts.forEach(post => {
      expect(post.privacy).to.equal('Public');
    });
  });
  
  it('should update the username when PATCH /username is called with a valid token and new username', async () => {
    const newUsername = 'janeDoe456';
  
    const response = await request(app)
      .patch('/user/username')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: newUsername });
  
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Username updated successfully');
    expect(response.body.userName).to.equal(newUsername);
  
    // Verify that the username was updated in the database
    const dbUser = await User.findOne({ userId: testUserId });
    expect(dbUser).to.exist;
    expect(dbUser.userName).to.equal(newUsername);
  });

  it('should update the privacy setting for a user and all their posts when PATCH /privacy is called with a valid token and a new privacy setting', async () => {
    const response = await request(app)
      .patch('/user/privacy')
      .set('Authorization', `Bearer ${token}`)
      .send({ privacy: true });
  
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Privacy setting updated successfully');
    expect(response.body.privacy).to.equal('Private');
  });

  after(async () => {
    // Clean up the test user
    await User.deleteOne({ userId: testUserId });

    // Close the server
    close();
  });
});

