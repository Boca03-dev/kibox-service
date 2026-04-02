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
  let adminToken = '';
  let createdId = '';

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kibox.com', password: 'admin123' });
    adminToken = adminRes.body.token;
  });

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
    createdId = res.body._id;
  });

  test('POST /api/messages - nedostaju obavezna polja vraca 500', async () => {
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

  test('GET /api/messages - admin vidi sve poruke', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/messages - poruke imaju ispravna polja', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${adminToken}`);

    const msg = res.body[0];
    expect(msg).toHaveProperty('name');
    expect(msg).toHaveProperty('email');
    expect(msg).toHaveProperty('message');
    expect(msg).toHaveProperty('read');
  });

  test('PUT /api/messages/:id/read - bez tokena vraca 401', async () => {
    const res = await request(app)
      .put(`/api/messages/${createdId}/read`);

    expect(res.statusCode).toBe(401);
  });

  test('PUT /api/messages/:id/read - admin oznacava poruku kao procitanu', async () => {
    const res = await request(app)
      .put(`/api/messages/${createdId}/read`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.read).toBe(true);
  });
});