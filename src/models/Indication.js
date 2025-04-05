const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Indication extends Model {}

Indication.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  condition: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  icd10Code: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'icd10_code'
  }
}, {
  sequelize,
  modelName: 'Indication',
  tableName: 'indications',
  timestamps: true,
  underscored: true
});

module.exports = Indication; 