const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class DrugIndication extends Model {}

DrugIndication.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  drug_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'drugs',
      key: 'id'
    }
  },
  indication_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'indications',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'DrugIndication',
  tableName: 'drug_indications',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['drug_id', 'indication_id']
    }
  ]
});

module.exports = DrugIndication; 