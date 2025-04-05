const { User, Indication, Drug, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Setup test database
const setupTestDatabase = async () => {
  try {
    // Instead of trying to truncate tables that might not exist,
    // sync the database to create the tables if they don't exist
    await sequelize.sync({ force: true });
    
    // Create a test admin user
    await User.create({
      username: 'testadmin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      active: true
    });
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

// Create a test user
const createTestUser = async (override = {}) => {
  const defaultUser = {
    username: `testuser_${Date.now()}`,
    email: `user_${Date.now()}@test.com`,
    password: 'password123',
    role: 'user',
    active: true
  };

  const userData = { ...defaultUser, ...override };
  
  return await User.create(userData);
};

// Create a test indication
const createTestIndication = async (override = {}) => {
  const defaultIndication = {
    name: `Test Indication ${Date.now()}`,
    description: 'Test Description for automated testing',
    icd10Code: 'A00.0',
    status: 'active'
  };

  const indicationData = { ...defaultIndication, ...override };
  
  return await Indication.create(indicationData);
};

// Create a test drug
const createTestDrug = async (override = {}) => {
  const defaultDrug = {
    name: `Test Drug ${Date.now()}`,
    description: 'Test drug description',
    brandName: 'Test Brand',
    manufacturer: 'Test Manufacturer',
    status: 'active'
  };

  const drugData = { ...defaultDrug, ...override };
  
  return await Drug.create(drugData);
};

// Generate a test JWT token
const generateTestToken = (user = { id: 1, role: 'admin' }) => {
  const secret = process.env.JWT_SECRET || 'testsecret';
  return jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn: '1h' }
  );
};

module.exports = {
  setupTestDatabase,
  createTestUser,
  createTestIndication,
  createTestDrug,
  generateTestToken,
  sequelize
}; 