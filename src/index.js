const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { testConnection, isDatabaseAvailable } = require('./config/database');
const { syncModels } = require('./models');
const { errorHandler } = require('./utils/errorHandler');
const { logger, stream } = require('./utils/logger');
const apiRoutes = require('./routes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ballast Node API',
      version: '1.0.0',
      description: 'API documentation for Ballast Node microservices',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    database: isDatabaseAvailable() ? 'connected' : 'using memory storage',
    timestamp: new Date() 
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    logger.info(`Server running on port ${PORT}`);
    
    // Check if we should force using memory store
    if (process.env.USE_MEMORY_STORE === 'true') {
      logger.info('Running in memory-only mode (no PostgreSQL connection)');
      logger.warn('All data will be lost when the server restarts');
      return;
    }
    
    // Test database connection
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      // Sync models with database
      try {
        // Set to true to force recreate tables (use with caution)
        await syncModels(false);
      } catch (err) {
        logger.error('Error synchronizing models:', err);
        logger.info('API is running but database operations will not work correctly');
      }
    } else {
      logger.warn('API is running but database connection failed.');
      logger.warn('Using in-memory storage as fallback - data will not persist when server restarts.');
      logger.warn('To set up the database:');
      logger.warn(`1. createdb ${process.env.DB_NAME} (if database doesn\'t exist)`);
      logger.warn(`2. Make sure the PostgreSQL user ${process.env.DB_USER} exists and has proper privileges`);
    }
  });
}

module.exports = app; 