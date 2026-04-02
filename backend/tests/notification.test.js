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

describe('Notifications API', () => {
  let userToken = '';
  let notificationId = '';

  beforeAll(async () => {
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bogdan@test.com', password: '123456' });
    userToken = userRes.body.token;
  });

  test('GET /api/notifications - bez tokena vraca 401', async () => {
    const res = await request(app)
      .get('/api/notifications');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/notifications - korisnik vidi svoje notifikacije', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/notifications - notifikacije imaju ispravna polja', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      const notif = res.body[0];
      expect(notif).toHaveProperty('title');
      expect(notif).toHaveProperty('body');
      expect(notif).toHaveProperty('read');
      notificationId = notif._id;
    }
  });

  test('PUT /api/notifications/read-all - bez tokena vraca 401', async () => {
    const res = await request(app)
      .put('/api/notifications/read-all');

    expect(res.statusCode).toBe(401);
  });

  test('PUT /api/notifications/read-all - korisnik oznacava sve kao procitane', async () => {
    const res = await request(app)
      .put('/api/notifications/read-all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/notifications/:id/read - bez tokena vraca 401', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/notifications/${fakeId}/read`);

    expect(res.statusCode).toBe(401);
  });

  test('PUT /api/notifications/:id/read - korisnik oznacava notifikaciju kao procitanu', async () => {
    if (!notificationId) {
      const list = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${userToken}`);
      if (list.body.length > 0) notificationId = list.body[0]._id;
    }
    if (!notificationId) return;

    const res = await request(app)
      .put(`/api/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.read).toBe(true);
  });

  test('DELETE /api/notifications/read-all - bez tokena vraca 401', async () => {
    const res = await request(app)
      .delete('/api/notifications/read-all');

    expect(res.statusCode).toBe(401);
  });

  test('DELETE /api/notifications/read-all - korisnik brise sve procitane', async () => {
    const res = await request(app)
      .delete('/api/notifications/read-all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/notifications/:id - bez tokena vraca 401', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/notifications/${fakeId}`);

    expect(res.statusCode).toBe(401);
  });

  test('DELETE /api/notifications/:id - korisnik brise svoju notifikaciju', async () => {
    if (!notificationId) return;

    const res = await request(app)
      .delete(`/api/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });
});