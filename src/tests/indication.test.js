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
          condition: 'Test Condition',
          icd10Code: 'A00.0'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.indication).toHaveProperty('id');
      expect(response.body.indication.condition).toBe('Test Condition');
      expect(response.body.indication.icd10Code).toBe('A00.0');
      
      // Save the created indication for other tests
      testIndication = response.body.indication;
    });
    
    it('should return 400 when condition is missing', async () => {
      const response = await request(app)
        .post('/api/indications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          icd10Code: 'A00.0'
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
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('indications');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.indications)).toBe(true);
    });
  });
  
  // Test getting indication by ID
  describe('GET /api/indications/:id', () => {
    it('should get indication by ID', async () => {
      const response = await request(app)
        .get(`/api/indications/${testIndication.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.indication.id).toBe(testIndication.id);
      expect(response.body.indication.condition).toBe(testIndication.condition);
    });
    
    it('should return 404 for non-existent indication', async () => {
      const response = await request(app)
        .get('/api/indications/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  // Test updating indication
  describe('PUT /api/indications/:id', () => {
    it('should update indication', async () => {
      const response = await request(app)
        .put(`/api/indications/${testIndication.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          condition: 'Updated Condition',
          icd10Code: 'A00.1'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.indication.condition).toBe('Updated Condition');
      expect(response.body.indication.icd10Code).toBe('A00.1');
    });
  });
  
  // Test deleting indication
  describe('DELETE /api/indications/:id', () => {
    it('should delete indication', async () => {
      const response = await request(app)
        .delete(`/api/indications/${testIndication.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify the indication is deleted
      const getResponse = await request(app)
        .get(`/api/indications/${testIndication.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getResponse.status).toBe(404);
    });
  });
}); 