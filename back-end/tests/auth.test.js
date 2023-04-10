const assert = require("chai").assert;
const request = require("supertest");
const app = require("../app");

describe("app", () => {
  it("GET / should return a login endpoint", async () => {
    const res = await request(app).get("/");
    assert.equal(res.status, 200);
    assert.property(res.body, "startsWith");
  });

  it("GET /callback should return an access token", async () => {
    const res = await request(app).get("/callback?code=test");
    assert.equal(res.status, 200);
    assert.property(res.body, "startsWith");
  });

  it("GET /recently-played should return recently played tracks", async () => {
    const res = await request(app).get("/recently-played");
    assert.equal(res.status, 200);
    assert.isArray(res.body);
  });

  it("GET /random-song should return a random song", async () => {
    const res = await request(app).get("/random-song");
    assert.equal(res.status, 200);
    assert.property(res.body, "name");
    assert.property(res.body, "artists");
    assert.property(res.body, "album");
  });

  it("GET /search-song?q= should return matching songs", async () => {
    const res = await request(app).get("/search-song?q=test");
    assert.equal(res.status, 200);
    assert.isArray(res.body);
  });
});

