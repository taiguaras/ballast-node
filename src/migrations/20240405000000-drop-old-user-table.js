'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the old User table exists
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );`
    );

    if (tableExists[0][0].exists) {
      // Drop the old User table if it exists
      await queryInterface.dropTable('User');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No down migration as we don't want to recreate the old table
  }
}; 