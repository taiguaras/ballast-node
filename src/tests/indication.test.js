const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../config/database');
const { User, Indication } = require('../models');
const { generateTestToken } = require('./helpers/testHelper');

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
    role: 'admin'
  });
  
  // Generate a token for authentication
  authToken = generateTestToken(testUser);
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
          description: 'Test Description',
          icd10Code: 'A00.0'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.indication).toHaveProperty('id');
      expect(response.body.data.indication.name).toBe('Test Indication');
      expect(response.body.data.indication.description).toBe('Test Description');
      expect(response.body.data.indication.icd10Code).toBe('A00.0');
      
      // Save the created indication for other tests
      testIndication = response.body.data.indication;
    });
    
    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/indications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Test Description',
          icd10Code: 'A00.0'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
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
      expect(response.body.data).toHaveProperty('indications');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.indications)).toBe(true);
    });
  });
  
  // Test getting indication by ID
  describe('GET /api/indications/:id', () => {
    beforeEach(async () => {
      // Create a test indication for the get test if it doesn't exist
      if (!testIndication) {
        const createResponse = await request(app)
          .post('/api/indications')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Indication for Get',
            description: 'Test Description',
            icd10Code: 'A00.0'
          });
        
        if (createResponse.body.data && createResponse.body.data.indication) {
          testIndication = createResponse.body.data.indication;
        }
      }
    });

    it('should get indication by ID', async () => {
      // Skip if no indication was created
      if (!testIndication) {
        console.log('Skipping test: No test indication available');
        return;
      }
      
      const response = await request(app)
        .get(`/api/indications/${testIndication.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.indication.id).toBe(testIndication.id);
      expect(response.body.data.indication.name).toBe(testIndication.name);
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
    beforeEach(async () => {
      // Create a test indication for the update test if it doesn't exist
      if (!testIndication) {
        const createResponse = await request(app)
          .post('/api/indications')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Indication for Update',
            description: 'Test Description',
            icd10Code: 'A00.0'
          });
        
        if (createResponse.body.data && createResponse.body.data.indication) {
          testIndication = createResponse.body.data.indication;
        }
      }
    });

    it('should update indication', async () => {
      // Skip if no indication was created
      if (!testIndication) {
        console.log('Skipping test: No test indication available');
        return;
      }
      
      const response = await request(app)
        .put(`/api/indications/${testIndication.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Indication',
          description: 'Updated Description',
          icd10Code: 'A00.1',
          status: 'inactive'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.indication.name).toBe('Updated Indication');
      expect(response.body.data.indication.description).toBe('Updated Description');
      expect(response.body.data.indication.icd10Code).toBe('A00.1');
      expect(response.body.data.indication.status).toBe('inactive');
    });
  });
  
  // Test deleting indication
  describe('DELETE /api/indications/:id', () => {
    beforeEach(async () => {
      // Create a test indication for the delete test if it doesn't exist
      if (!testIndication) {
        const createResponse = await request(app)
          .post('/api/indications')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Test Indication for Delete',
            description: 'Test Description',
            icd10Code: 'A00.0'
          });
        
        if (createResponse.body.data && createResponse.body.data.indication) {
          testIndication = createResponse.body.data.indication;
        }
      }
    });

    it('should delete indication', async () => {
      // Skip if no indication was created
      if (!testIndication) {
        console.log('Skipping test: No test indication available');
        return;
      }
      
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

      // Reset testIndication so the next test can create a new one
      testIndication = null;
    });
  });
}); 