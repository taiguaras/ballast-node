const { Sequelize } = require('sequelize');
require('dotenv').config();
const memoryStore = require('../utils/memoryStore');

// Flag to track database availability
let isDatabaseAvailable = false;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    isDatabaseAvailable = true;
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    
    // Provide helpful information about the error
    if (error.original && error.original.code === '28000') {
      console.log('\nPossible fixes:');
      console.log('1. Check if PostgreSQL is running');
      console.log('2. Update .env with correct DB_USER and DB_PASSWORD');
      console.log('3. Make sure the specified user exists in PostgreSQL');
      console.log('4. You may need to create the database first:');
      console.log(`   $ createdb ${process.env.DB_NAME}`);
    }
    
    console.log('\nSwitching to in-memory storage as fallback. Note that data will not persist when the server restarts.');
    isDatabaseAvailable = false;
    return false;
  }
};

// Function to get appropriate storage (DB or memory)
const getStorage = () => {
  if (isDatabaseAvailable) {
    return { type: 'database', sequelize };
  } else {
    return { type: 'memory', store: memoryStore };
  }
};

module.exports = {
  sequelize,
  testConnection,
  getStorage,
  isDatabaseAvailable: () => isDatabaseAvailable
}; 