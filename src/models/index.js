const User = require('./User');
const Indication = require('./Indication');
const { sequelize } = require('../config/database');
const Drug = require('./Drug');
const DrugIndication = require('./DrugIndication');

// Define relationships
User.hasMany(Indication, { foreignKey: 'user_id' });
Indication.belongsTo(User, { foreignKey: 'user_id' });

// Drug and Indication have a many-to-many relationship through DrugIndication
Drug.belongsToMany(Indication, {
  through: DrugIndication,
  foreignKey: 'drug_id',
  otherKey: 'indication_id'
});

Indication.belongsToMany(Drug, {
  through: DrugIndication,
  foreignKey: 'indication_id',
  otherKey: 'drug_id'
});

// DrugIndication belongs to both Drug and Indication
DrugIndication.belongsTo(Drug);
DrugIndication.belongsTo(Indication);

// Function to sync all models with the database
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    throw error;
  }
};

module.exports = {
  User,
  Indication,
  Drug,
  DrugIndication,
  syncModels,
  sequelize
}; 