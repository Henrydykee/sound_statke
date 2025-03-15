// tests/controllers/transactions/transaction.test.ts
import request from 'supertest';
import app from '../src/server';
import { AuthRequest } from '../src/types/types';
import { Transaction, TransactionType } from '../src/models/transaction';
import { getWalletBalance, fundWallet } from '../src/services/transaction/wallet';
import { createTransaction } from '../src/services/transaction/transaction';
import connectDB from '../src/config/db';

describe('Transaction Controller', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await connectDB();
    const response = await request(app)
      .post('/api/auth/user/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        dob: '1995-08-10',
        nationality: 'Nigerian',
        preferredCurrency: 'NGN',
        password: 'SecurePass123!',
      });

      console.log(response.body);

    token = response.body.token;
    userId = response.body.user._id;
  });

  describe('GET /wallet/balance', () => {
    it('should return user balance', async () => {
      const response = await request(app)
        .get('/api/transactions/wallet/balance')
        .set('Authorization', `Bearer ${token}`);


      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('balance');
    });

    it('should return error if wallet balance retrieval fails', async () => {
      // You need to simulate an error in the getWalletBalance function
      // This could be done by modifying the function to throw an error
      // or by using a library like sinon to stub the function and make it throw an error
      const response = await request(app)
        .get('/api/wallet/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /wallet/fund', () => {
    it('should fund user wallet', async () => {
      const amount = 100;
      const currency = 'USD';

      const response = await request(app)
        .post('/api/wallet/fund')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount, currency });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('wallet');
    });

    it('should return error if wallet funding fails', async () => {
      // You need to simulate an error in the fundWallet function
      // This could be done by modifying the function to throw an error
      // or by using a library like sinon to stub the function and make it throw an error
      const amount = 100;
      const currency = 'USD';

      const response = await request(app)
        .post('/api/wallet/fund')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount, currency });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /transactions', () => {
    it('should return user transaction history', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should return error if transaction history retrieval fails', async () => {
      // You need to simulate an error in the Transaction.find function
      // This could be done by modifying the function to throw an error
      // or by using a library like sinon to stub the function and make it throw an error
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });
});