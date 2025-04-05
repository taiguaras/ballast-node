'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('drug_indications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      drug_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'drugs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      indication_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'indications',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add a unique constraint to prevent duplicate associations
    await queryInterface.addConstraint('drug_indications', {
      fields: ['drug_id', 'indication_id'],
      type: 'unique',
      name: 'unique_drug_indication'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('drug_indications');
  }
}; 