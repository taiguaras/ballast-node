const { Indication, sequelize } = require('../models');

// Process a JSON file with indications data
const processJsonFile = async (req, res) => {
  try {
    // Check if there's a file in the request
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse JSON data from file
    let jsonData;
    try {
      const fileContent = req.file.buffer.toString('utf8');
      jsonData = JSON.parse(fileContent);
    } catch (parseError) {
      return res.status(400).json({ message: 'Invalid JSON file' });
    }

    // Validate JSON structure
    if (!Array.isArray(jsonData) && !jsonData.indications) {
      return res.status(400).json({ 
        message: 'Invalid JSON structure. Expected an array or an object with indications array' 
      });
    }

    // Extract indications data
    const indicationsData = Array.isArray(jsonData) ? jsonData : jsonData.indications;

    // Process indications
    const processedIndications = [];
    const errors = [];
    const transaction = await sequelize.transaction();

    try {
      for (const data of indicationsData) {
        // Validate required fields
        if (!data.name) {
          errors.push({ data, error: 'Missing name field' });
          continue;
        }

        // Check if indication already exists
        let indication = await Indication.findOne({
          where: { name: data.name },
          transaction
        });

        if (indication) {
          // Update occurrences count
          await indication.update({
            occurrences: indication.occurrences + (data.occurrences || 1),
            lastProcessed: new Date()
          }, { transaction });
        } else {
          // Create new indication
          indication = await Indication.create({
            name: data.name,
            description: data.description,
            category: data.category,
            priority: data.priority || 0,
            metadata: data.metadata || {},
            source: data.source || 'file_import',
            occurrences: data.occurrences || 1,
            lastProcessed: new Date(),
            userId: req.user.id
          }, { transaction });
        }

        processedIndications.push(indication);
      }

      // Commit transaction
      await transaction.commit();

      // Return results
      return res.status(200).json({
        message: 'File processed successfully',
        results: {
          total: indicationsData.length,
          processed: processedIndications.length,
          errors: errors.length
        },
        indications: processedIndications.map(i => ({
          id: i.id,
          name: i.name,
          occurrences: i.occurrences
        })),
        errors
      });
    } catch (processingError) {
      // Rollback transaction
      await transaction.rollback();
      throw processingError;
    }
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  processJsonFile
}; 