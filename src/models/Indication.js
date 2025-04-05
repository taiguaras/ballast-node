'use strict';
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Indication extends Model {
  static associate(models) {
    Indication.belongsToMany(models.Drug, {
      through: 'DrugIndication',
      foreignKey: 'indication_id',
      otherKey: 'drug_id'
    });
  }
}

Indication.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Description cannot be empty'
      }
    }
  },
  icd10Code: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'icd10_code',
    validate: {
      notEmpty: {
        msg: 'ICD-10 code cannot be empty'
      }
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['active', 'inactive']],
        msg: 'Status must be either active or inactive'
      }
    }
  }
}, {
  sequelize,
  modelName: 'Indication',
  tableName: 'indications',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Indication; 