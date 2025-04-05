const { Indication } = require('../models');
const { Op } = require('sequelize');

// Get all indications with pagination
const getAllIndications = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build where clause for search
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { icd10Code: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Execute query
    const result = await Indication.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(result.count / limit);
    
    res.status(200).json({
      success: true,
      data: {
        indications: result.rows,
        pagination: {
          total: result.count,
          totalPages,
          page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting indications:', error);
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
      data: { indication }
    });
  } catch (error) {
    console.error('Error getting indication:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Create new indication
const createIndication = async (req, res) => {
  try {
    const { name, description, icd10Code, status } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }
    
    if (!icd10Code) {
      return res.status(400).json({
        success: false,
        message: 'ICD-10 code is required'
      });
    }
    
    // Create indication
    const indication = await Indication.create({
      name,
      description,
      icd10Code,
      status: status || 'active'
    });
    
    res.status(201).json({
      success: true,
      message: 'Indication created successfully',
      data: { indication }
    });
  } catch (error) {
    console.error('Error creating indication:', error);
    
    // Check if validation error
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }
    
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
    const { name, description, icd10Code, status } = req.body;
    
    // Find indication
    const indication = await Indication.findByPk(id);
    
    if (!indication) {
      return res.status(404).json({ 
        success: false,
        message: 'Indication not found' 
      });
    }
    
    // Prepare update data with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icd10Code !== undefined) updateData.icd10Code = icd10Code;
    if (status !== undefined) updateData.status = status;
    
    // Update indication
    await indication.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Indication updated successfully',
      data: { indication }
    });
  } catch (error) {
    console.error('Error updating indication:', error);
    
    // Check if validation error
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }
    
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