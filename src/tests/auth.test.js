const request = require('supertest');
const app = require('../index');
const { User, sequelize } = require('../models');
const { setupTestDatabase } = require('./helpers/testHelper');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('User Registration', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.username).toBe(userData.username);
      expect(response.body.data.user.email).toBe(userData.email);
      // Password should not be returned
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should not register a user with an existing username', async () => {
      const userData = {
        username: 'testadmin', // Already exists from setup
        email: 'different@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('User Login', () => {
    it('should login with correct credentials and return a token', async () => {
      const loginData = {
        email: 'admin@test.com', // From setupTestDatabase
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should not login with incorrect password', async () => {
      const loginData = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
}); 