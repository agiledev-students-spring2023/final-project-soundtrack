import { app, close } from '../server.js';
import request from 'supertest';
import { expect } from 'chai';
import Post from '../models/Post.js';

describe('Browse route', () => {
  const testPosts = [];

  before(async () => {
    // Set up test data
    for (let i = 0; i < 5; i++) {
      const post = new Post({
        userId: `test-user-${i + 1}`,
        userName: `Test User ${i + 1}`,
        avatar: `https://test-avatar-url.com/avatar-${i + 1}`,
        songTitle: { title: `Test song ${i + 1}`, artist: `Test artist ${i + 1}` },
        imageURL: `https://test-image-url.com/image-${i + 1}`,
        locationName: { place: `Test place ${i + 1}`, country: `Test country ${i + 1}` },
        privacy: 'Public',
      });
      await post.save();
      testPosts.push(post);
    }
  });

  after(async () => {
    // Clean up test data
    await Post.deleteMany({ _id: { $in: testPosts.map((post) => post._id) } });
    await close();
  });

  describe('GET /browse/:skip/:limit', () => {
    it('should return the specified number of public posts', async () => {
      const skip = 1;
      const limit = 2;
      const res = await request(app).get(`/browse/${skip}/${limit}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(limit);
      expect(res.body[0].songTitle.title).to.equal('Test song 4');
      expect(res.body[1].songTitle.title).to.equal('Test song 3');
    });
  });
});



