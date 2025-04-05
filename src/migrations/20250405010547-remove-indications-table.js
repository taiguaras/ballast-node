'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the foreign key constraints
    await queryInterface.removeConstraint('drug_indications', 'drug_indications_indication_id_fkey');
    
    // Then drop the Indications table
    await queryInterface.dropTable('Indications');
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the Indications table
    await queryInterface.createTable('Indications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'active',
        allowNull: false
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      source: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Recreate the foreign key constraint
    await queryInterface.addConstraint('drug_indications', {
      fields: ['indication_id'],
      type: 'foreign key',
      name: 'drug_indications_indication_id_fkey',
      references: {
        table: 'Indications',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  }
};
