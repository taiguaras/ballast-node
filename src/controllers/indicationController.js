const { Indication, sequelize } = require('../models');

// Get all indications with pagination
const getAllIndications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Execute query
    const result = await Indication.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(result.count / limit);
    
    res.status(200).json({
      success: true,
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
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Get indication by ID
const getIndicationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ 
        success: false,
        message: 'Indication not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      indication
    });
  } catch (error) {
    console.error('Error fetching indication:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Create new indication
const createIndication = async (req, res) => {
  try {
    const { condition, icd10Code } = req.body;
    
    // Create indication
    const indication = await Indication.create({
      condition,
      icd10Code,
      userId: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      message: 'Indication created successfully',
      indication
    });
  } catch (error) {
    console.error('Error creating indication:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Update indication
const updateIndication = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, icd10Code } = req.body;
    
    // Find indication
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ 
        success: false,
        message: 'Indication not found' 
      });
    }
    
    // Update indication
    await indication.update({
      condition,
      icd10Code
    });
    
    res.status(200).json({
      success: true,
      message: 'Indication updated successfully',
      indication
    });
  } catch (error) {
    console.error('Error updating indication:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Delete indication
const deleteIndication = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find indication
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ 
        success: false,
        message: 'Indication not found' 
      });
    }
    
    // Delete indication
    await indication.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Indication deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting indication:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  getAllIndications,
  getIndicationById,
  createIndication,
  updateIndication,
  deleteIndication
}; 