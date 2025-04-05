const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Drug extends Model {}

Drug.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  brandName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'brand_name'
  },
  manufacturer: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
    defaultValue: 'active',
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Drug',
  tableName: 'drugs',
  timestamps: true,
  underscored: true
});

module.exports = Drug; 