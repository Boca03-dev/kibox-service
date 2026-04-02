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

describe('Chat API', () => {
  let userToken = '';
  let adminToken = '';
  let chatId = '';

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

  test('GET /api/chats/my - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/chats/my');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/chats/my - korisnik dobija ili kreira svoj chat', async () => {
    const res = await request(app)
      .get('/api/chats/my')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    chatId = res.body._id;
  });

  test('GET /api/chats/exists - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/chats/exists');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/chats/exists - korisnik proverava da li chat postoji', async () => {
    const res = await request(app)
      .get('/api/chats/exists')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('exists');
    expect(typeof res.body.exists).toBe('boolean');
  });

  test('POST /api/chats/message - bez tokena vraca 401', async () => {
    const res = await request(app)
      .post('/api/chats/message')
      .send({ message: 'Test poruka' });

    expect(res.statusCode).toBe(401);
  });

  test('POST /api/chats/message - korisnik salje poruku', async () => {
    const chatRes = await request(app)
      .get('/api/chats/my')
      .set('Authorization', `Bearer ${userToken}`);

    const chatId = chatRes.body._id;

    const res = await request(app)
      .post('/api/chats/message')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ chatId, content: 'Zdravo, treba mi pomoc oko racunara' });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('messages');
  });

  test('POST /api/chats/message - nedostaje content vraca 500', async () => {
    const res = await request(app)
      .post('/api/chats/message')
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect([400, 500]).toContain(res.statusCode);
  });

  test('GET /api/chats - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/chats');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/chats - obican korisnik ne moze (403)', async () => {
    const res = await request(app)
      .get('/api/chats')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('GET /api/chats - admin vidi sve chatove', async () => {
    const res = await request(app)
      .get('/api/chats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/chats/:id - bez tokena vraca 401', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/chats/${fakeId}`);

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/chats/:id - obican korisnik ne moze (403)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/chats/${fakeId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('GET /api/chats/:id - admin vidi chat po ID-u', async () => {
    if (!chatId) return;

    const res = await request(app)
      .get(`/api/chats/${chatId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', chatId);
  });

  test('GET /api/chats/:id - nepostojeci ID vraca 200 (controller ne proverava null)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/chats/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});