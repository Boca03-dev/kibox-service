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

describe('Games API', () => {
  let adminToken = '';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kibox.com', password: 'admin123' });
    adminToken = res.body.token;
  });

  test('GET /api/games - vraca sve igrice', async () => {
    const res = await request(app).get('/api/games');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/games - igrice imaju ispravna polja', async () => {
    const res = await request(app).get('/api/games');
    const game = res.body[0];
    expect(game).toHaveProperty('name');
    expect(game).toHaveProperty('minRequirements');
    expect(game).toHaveProperty('recommendedRequirements');
  });

  test('POST /api/games - bez tokena vraca 401', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ name: 'Test igrica' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/games - admin moze da doda igricu', async () => {
    const res = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Jest Test Game',
        minRequirements: { ramGB: 8, gpuPerformance: 50, cpuPerformance: 60 },
        recommendedRequirements: { ramGB: 16, gpuPerformance: 75, cpuPerformance: 75 }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Jest Test Game');
  });

  test('DELETE /api/games/:id - admin moze da obrise igricu', async () => {
    const create = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Za brisanje',
        minRequirements: { ramGB: 4, gpuPerformance: 30, cpuPerformance: 40 },
        recommendedRequirements: { ramGB: 8, gpuPerformance: 50, cpuPerformance: 60 }
      });

    const res = await request(app)
      .delete(`/api/games/${create.body._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});