import { app, close } from '../server.js';
import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

describe('Spotify API Auth route', () => {
  after(async () => {
    await close();
  });

  describe('GET /auth', () => {
    it('should return the login endpoint URL', async () => {
      const res = await request(app).get('/auth');
      expect(res.status).to.equal(200);
      expect(res.text).to.include('https://accounts.spotify.com/authorize');
    });
  });
});






