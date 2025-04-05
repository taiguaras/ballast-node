const drugProcessor = require('../utils/drugProcessor');

/**
 * Process a JSON file containing drug data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processJsonFile = async (req, res) => {
  const startTime = Date.now();
  console.log('=== Starting File Processing Pipeline ===');
  
  try {
    console.log('[1/5] Validating request...');
    if (!req.file) {
      console.error('❌ No file provided in request');
      return res.status(400).json({ error: 'No file provided' });
    }
    console.log('✅ Request validation complete');

    console.log('[2/5] Parsing JSON file...');
    const fileContent = JSON.parse(req.file.buffer.toString());
    console.log(`✅ JSON file parsed successfully (${fileContent.length} bytes)`);

    console.log('[3/5] Processing drug label data...');
    const processedDrugLabel = await drugProcessor.processDrugLabel(fileContent);
    console.log('✅ Drug label processing complete');

    console.log('[4/5] Processing copay card data...');
    const processedCopayCard = drugProcessor.processCopayCard(fileContent);
    console.log('✅ Copay card processing complete');

    console.log('[5/5] Combining processed data...');
    const result = {
      drugLabel: processedDrugLabel,
      copayCard: processedCopayCard,
      timestamp: new Date().toISOString(),
      processingTime: `${Date.now() - startTime}ms`
    };

    console.log('=== File Processing Pipeline Completed Successfully ===');
    console.log(`Total processing time: ${Date.now() - startTime}ms`);
    res.json(result);
  } catch (error) {
    console.error('❌ Error in file processing pipeline:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Error processing file', 
      details: error.message,
      processingTime: `${Date.now() - startTime}ms`
    });
  }
};

module.exports = {
  processJsonFile
}; 