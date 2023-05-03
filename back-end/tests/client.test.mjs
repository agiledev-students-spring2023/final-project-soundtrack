import { app, close } from '../server.js';
import request from 'supertest';
import { expect } from 'chai';

describe('Spotify API authentication route', () => {
  after(async () => {
    await close();
  });

  describe('GET /client', () => {
    it('should successfully authenticate with the Spotify API and return an access token', async () => {
        const res = await request(app).get('/client');
        //console.log('Response body (success case):', res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('access_token');
        expect(res.body.access_token).to.be.a('string');
      });
  });

  describe('Spotify API search song route', () => {
    describe('GET /client/search-song', () => {
        it('should return search results for a valid query', async () => {
            const query = 'Imagine Dragons';
            const res = await request(app).get(`/client/search-song?q=${encodeURIComponent(query)}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.gt(0);
            expect(res.body[0]).to.have.property('id');
            expect(res.body[0]).to.have.property('name');
            expect(res.body[0]).to.have.property('artists');
          });

    });
  });
});
