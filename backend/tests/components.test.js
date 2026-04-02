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

describe('Components API', () => {
  let adminToken = '';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kibox.com', password: 'admin123' });
    adminToken = res.body.token;
  });

  test('GET /api/components - vraca sve komponente', async () => {
    const res = await request(app).get('/api/components');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/components?type=cpu - filtrira po tipu', async () => {
    const res = await request(app).get('/api/components?type=cpu');
    expect(res.statusCode).toBe(200);
    res.body.forEach((c) => expect(c.type).toBe('cpu'));
  });

  test('POST /api/components - bez tokena vraca 401', async () => {
    const res = await request(app)
      .post('/api/components')
      .send({ name: 'Test', type: 'cpu', brand: 'Test', price: 100, performance: 50 });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/components - admin moze da doda komponentu', async () => {
    const res = await request(app)
      .post('/api/components')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test CPU Jest', type: 'cpu', brand: 'TestBrand', price: 100, performance: 50, tdp: 65 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test CPU Jest');
  });

  test('DELETE /api/components/:id - admin moze da obrise komponentu', async () => {
    const create = await request(app)
      .post('/api/components')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Za brisanje', type: 'gpu', brand: 'Test', price: 200, performance: 60, tdp: 100 });

    const res = await request(app)
      .delete(`/api/components/${create.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});