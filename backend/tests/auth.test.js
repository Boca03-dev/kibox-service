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

describe('Auth API', () => {
  const testUser = {
    name: 'Test Korisnik',
    email: `test${Date.now()}@test.com`,
    password: '123456'
  };

  let token = '';

  test('POST /api/auth/register - uspešna registracija', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
    token = res.body.token;
  });

  test('POST /api/auth/register - dupli email vraca 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email već postoji');
  });

  test('POST /api/auth/login - uspešan login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - pogrešna lozinka vraca 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'pogresna' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Pogrešan email ili lozinka');
  });

  test('POST /api/auth/login - nepostojeci email vraca 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nepostoji@test.com', password: '123456' });

    expect(res.statusCode).toBe(400);
  });

  test('Auth middleware - zahtev bez Authorization headera vraca 401', async () => {
    const res = await request(app)
      .get('/api/appointments');

    expect(res.statusCode).toBe(401);
  });

  test('Auth middleware - malformiran token vraca 401', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', 'Bearer ovonijevalidantoken123');

    expect(res.statusCode).toBe(401);
  });

  test('Auth middleware - token bez Bearer prefiksa vraca 401', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', token);

    expect(res.statusCode).toBe(401);
  });

  test('Auth middleware - validan token prolazi', async () => {
    const res = await request(app)
      .get('/api/configurations/my')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});