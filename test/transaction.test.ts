// tests/controllers/transactions/transaction.test.ts
import request from 'supertest';
import app from '../src/server';
import connectDB, { closeDB } from '../src/config/db';
import { successResponse } from '../src/utils/response';
import { Console } from 'console';

describe('Transaction Controller', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await connectDB();
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        dob: '1995-08-10',
        nationality: 'Nigerian',
        preferredCurrency: 'NGN',
        password: 'SecurePass123!',
      });

    token = response.body.data.token;
    userId = response.body.data.id;
  });

  afterAll(async () => {
    await closeDB();
  });

  describe('GET /wallet/balance', () => {
    it('should return user balance', async () => {
      const response = await request(app)
        .get('/api/transactions/wallet/balance')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'Balance fetched successfully.',
        status: true,
        data: expect.objectContaining({
          balance: expect.objectContaining({
            balanceNGN: expect.any(Number),
            balanceUSD: expect.any(Number),
          }),
        }),
      });
    });
  });

  describe('POST /wallet/fund', () => {
    it('should fund user wallet', async () => {
      const amount = 100;
      const currency = 'USD';
  
      const response = await request(app)
        .post('/api/transactions/wallet/fund')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount, currency });
  
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'Wallet funded successfully.',
        status: true,
        data: expect.objectContaining({
          wallet: expect.objectContaining({
            balanceNGN: expect.any(Number),
            balanceUSD: expect.any(Number),
          }),
        }),
      });
    });
  });

  describe('GET /transactions', () => {
    it('should return user transaction history', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'Transaction history fetched successfully.', 
        status: true,
        data: expect.objectContaining({
          transactions: expect.any(Array),
          pagination: expect.objectContaining({
            total: expect.any(Number),
            page: expect.any(Number),
            limit: expect.any(Number),
            totalPages: expect.any(Number),
          }),
        }),
      });
    });
  });
});