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

describe('Configurations API', () => {
  let userToken = '';
  let adminToken = '';
  let savedConfigId = '';

  beforeAll(async () => {
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bogdan@test.com', password: '123456' });
    userToken = userRes.body.token;

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kibox.com', password: 'admin123' });
    adminToken = adminRes.body.token;
  });

  test('POST /api/configurations/generate - generise gaming konfiguraciju', async () => {
    const res = await request(app)
      .post('/api/configurations/generate')
      .send({ budget: 1500, purpose: 'gaming' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('cpu');
    expect(res.body).toHaveProperty('gpu');
    expect(res.body).toHaveProperty('totalPrice');
    expect(res.body.totalPrice).toBeLessThanOrEqual(1500);
  });

  test('POST /api/configurations/generate - mali budzet vraca 404', async () => {
    const res = await request(app)
      .post('/api/configurations/generate')
      .send({ budget: 10, purpose: 'gaming' });

    expect(res.statusCode).toBe(404);
  });

  test('POST /api/configurations - bez tokena vraca 401', async () => {
    const res = await request(app)
      .post('/api/configurations')
      .send({ name: 'Test config' });

    expect(res.statusCode).toBe(401);
  });

  test('POST /api/configurations - korisnik cuva konfiguraciju', async () => {
    const res = await request(app)
      .post('/api/configurations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Moja gaming konfiguracija',
        components: {}
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    savedConfigId = res.body._id;
  });

  test('GET /api/configurations/my - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/configurations/my');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/configurations/my - korisnik vidi svoje konfiguracije', async () => {
    const res = await request(app)
      .get('/api/configurations/my')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/configurations/all - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/configurations/all');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/configurations/all - obican korisnik ne moze (403)', async () => {
    const res = await request(app)
      .get('/api/configurations/all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('GET /api/configurations/all - admin vidi sve konfiguracije', async () => {
    const res = await request(app)
      .get('/api/configurations/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/configurations/:id/send - bez tokena vraca 401', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/configurations/${fakeId}/send`);

    expect(res.statusCode).toBe(401);
  });

  test('PUT /api/configurations/:id/send - korisnik salje konfiguraciju adminu', async () => {
    if (!savedConfigId) return;

    const res = await request(app)
      .put(`/api/configurations/${savedConfigId}/send`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/configurations/:id - bez tokena vraca 401', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/configurations/${fakeId}`);

    expect(res.statusCode).toBe(401);
  });

  test('DELETE /api/configurations/:id - korisnik brise svoju konfiguraciju', async () => {
    if (!savedConfigId) return;

    const res = await request(app)
      .delete(`/api/configurations/${savedConfigId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });
});