const { Indication, sequelize } = require('../models');

// Get all indications with pagination
const getAllIndications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, sort = 'createdAt', order = 'DESC' } = req.query;
    
    // Build where clause
    const whereClause = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Execute query
    const result = await Indication.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, order.toUpperCase()]],
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(result.count / limit);
    
    res.status(200).json({
      indications: result.rows,
      pagination: {
        totalItems: result.count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching indications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get indication by ID
const getIndicationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ message: 'Indication not found' });
    }
    
    res.status(200).json(indication);
  } catch (error) {
    console.error('Error fetching indication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new indication
const createIndication = async (req, res) => {
  try {
    const { name, description, category, priority, metadata, source } = req.body;
    
    // Create indication
    const indication = await Indication.create({
      name,
      description,
      category,
      priority,
      metadata,
      source,
      userId: req.user.id,
    });
    
    res.status(201).json({
      message: 'Indication created successfully',
      indication
    });
  } catch (error) {
    console.error('Error creating indication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update indication
const updateIndication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, status, priority, metadata, source } = req.body;
    
    // Find indication
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ message: 'Indication not found' });
    }
    
    // Update indication
    await indication.update({
      name,
      description,
      category,
      status,
      priority,
      metadata,
      source
    });
    
    res.status(200).json({
      message: 'Indication updated successfully',
      indication
    });
  } catch (error) {
    console.error('Error updating indication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete indication
const deleteIndication = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find indication
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ message: 'Indication not found' });
    }
    
    // Delete indication
    await indication.destroy();
    
    res.status(200).json({
      message: 'Indication deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting indication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Increment occurrences
const incrementOccurrences = async (req, res) => {
  try {
    const { id } = req.params;
    const { count = 1 } = req.body;
    
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ message: 'Indication not found' });
    }
    
    // Update occurrences and lastProcessed
    await indication.update({
      occurrences: indication.occurrences + parseInt(count),
      lastProcessed: new Date()
    });
    
    res.status(200).json({
      message: 'Occurrences updated successfully',
      indication
    });
  } catch (error) {
    console.error('Error updating occurrences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllIndications,
  getIndicationById,
  createIndication,
  updateIndication,
  deleteIndication,
  incrementOccurrences
}; 