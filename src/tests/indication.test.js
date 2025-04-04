const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../config/database');
const { User, Indication } = require('../models');

let authToken;
let testUser;
let testIndication;

// Setup before tests
beforeAll(async () => {
  // Sync database with force true to clean up
  await sequelize.sync({ force: true });
  
  // Create a test user
  testUser = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  });
  
  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  
  authToken = loginResponse.body.token;
});

// Clean up after tests
afterAll(async () => {
  await sequelize.close();
});

describe('Indication API Tests', () => {
  // Test creating a new indication
  describe('POST /api/indications', () => {
    it('should create a new indication', async () => {
      const response = await request(app)
        .post('/api/indications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Indication',
          description: 'This is a test indication',
          category: 'Test Category',
          priority: 1,
          metadata: { test: true },
          source: 'test'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.indication).toHaveProperty('id');
      expect(response.body.indication.name).toBe('Test Indication');
      
      // Save the created indication for other tests
      testIndication = response.body.indication;
    });
    
    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/indications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing name indication',
          category: 'Test Category'
        });
      
      expect(response.status).toBe(400);
    });
  });
  
  // Test getting all indications
  describe('GET /api/indications', () => {
    it('should get all indications with pagination', async () => {
      const response = await request(app)
        .get('/api/indications')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('indications');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.indications)).toBe(true);
    });
    
    it('should filter indications by category', async () => {
      const response = await request(app)
        .get('/api/indications?category=Test%20Category')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.indications.length).toBeGreaterThan(0);
      expect(response.body.indications[0].category).toBe('Test Category');
    });
  });
  
  // Add more test cases as needed
}); 