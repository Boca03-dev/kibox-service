const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Messages API', () => {
  test('POST /api/messages - uspešno slanje poruke', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        name: 'Test Korisnik',
        email: 'test@test.com',
        phone: '0601234567',
        message: 'Ovo je test poruka'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.read).toBe(false);
  });

  test('POST /api/messages - nedostaju obavezna polja', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ name: 'Test' });

    expect(res.statusCode).toBe(500);
  });

  test('GET /api/messages - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/messages');

    expect(res.statusCode).toBe(401);
  });
});