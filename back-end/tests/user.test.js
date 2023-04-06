const request = require('supertest');
const app = require('/Users/isabellamasiero/Desktop/final-project-soundtrack/front-end/src/App.js'); // assuming the router is mounted on an Express app

describe('GET /users', () => {
  it('should respond with an array of users', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should handle errors', async () => {
    // mock the readFile function to simulate an error
    jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => {
      callback(new Error('mock error'));
    });

    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(500);

    // restore the original function
    jest.restoreAllMocks();
  });
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const newUser = { username: 'testuser', password: 'testpass' };
    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);

    // check that the user was actually created
    const usersResponse = await request(app).get('/users');
    expect(usersResponse.body.some(user => user.username === newUser.username)).toBe(true);
  });

  it('should handle errors', async () => {
    // mock the readFile function to simulate an error
    jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => {
      callback(new Error('mock error'));
    });

    const response = await request(app).post('/users').send({ username: 'testuser', password: 'testpass' });
    expect(response.statusCode).toBe(500);

    // restore the original function
    jest.restoreAllMocks();
  });

  it('should return an error if the username already exists', async () => {
    // add a user with the same username before sending the request
    const existingUser = { username: 'testuser', password: 'testpass' };
    await request(app).post('/users').send(existingUser);

    const response = await request(app).post('/users').send(existingUser);
    expect(response.statusCode).toBe(400);
  });
});
