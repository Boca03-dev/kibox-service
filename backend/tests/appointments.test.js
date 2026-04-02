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
  let adminToken = '';
  let userToken = '';
  let createdId = '';

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kibox.com', password: 'admin123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bogdan@test.com', password: '123456' });
    userToken = userRes.body.token;
  });

  test('POST /api/appointments - uspešno zakazivanje', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({
        name: 'Test Korisnik',
        email: 'bogdan@test.com',
        phone: '0601234567',
        description: 'Laptop se pregrejava',
        date: '2026-06-01T10:00:00.000Z'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.status).toBe('pending');
    createdId = res.body._id;
  });

  test('POST /api/appointments - nedostaju obavezna polja vraca 500', async () => {
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

  test('GET /api/appointments - obican korisnik ne moze (403)', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('GET /api/appointments - admin vidi sve termine', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/appointments/my - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/appointments/my');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/appointments/my - korisnik vidi svoje termine', async () => {
    const res = await request(app)
      .get('/api/appointments/my')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/appointments/:id - bez tokena vraca 401', async () => {
    const res = await request(app)
      .put(`/api/appointments/${createdId}`)
      .send({ status: 'confirmed' });

    expect(res.statusCode).toBe(401);
  });

  test('PUT /api/appointments/:id - obican korisnik ne moze (403)', async () => {
    const res = await request(app)
      .put(`/api/appointments/${createdId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'confirmed' });

    expect(res.statusCode).toBe(403);
  });

  test('PUT /api/appointments/:id - admin potvrdjuje termin', async () => {
    const res = await request(app)
      .put(`/api/appointments/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });

  test('PUT /api/appointments/:id - admin otkazuje termin', async () => {
    const res = await request(app)
      .put(`/api/appointments/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'cancelled' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('cancelled');
  });

  test('PUT /api/appointments/seen - obican korisnik dobija 403 (bag u redosledu ruta)', async () => {
    const res = await request(app)
      .put('/api/appointments/seen')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});