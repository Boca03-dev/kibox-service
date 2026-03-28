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

describe('Appointments API', () => {
  test('POST /api/appointments - uspešno zakazivanje', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        name: 'Test Korisnik',
        email: 'test@test.com',
        phone: '0601234567',
        description: 'Laptop se pregrejava',
        date: '2026-06-01T10:00:00.000Z'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.status).toBe('pending');
  });

  test('POST /api/appointments - nedostaju obavezna polja', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ name: 'Test' });

    expect(res.statusCode).toBe(500);
  });

  test('GET /api/appointments - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/appointments');

    expect(res.statusCode).toBe(401);
  });
});