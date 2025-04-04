const User = require('./User');
const Indication = require('./Indication');
const { sequelize } = require('../config/database');

// Define relationships
User.hasMany(Indication, { foreignKey: 'userId' });
Indication.belongsTo(User, { foreignKey: 'userId' });

// Function to sync all models with the database
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

module.exports = {
  User,
  Indication,
  syncModels,
  sequelize
}; 