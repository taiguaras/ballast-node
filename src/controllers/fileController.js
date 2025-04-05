const { Drug, Indication, DrugIndication } = require('../models');
const drugProcessor = require('../utils/drugProcessor');

/**
 * Process a JSON file containing drug data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processJsonFile = async (req, res) => {
  const startTime = Date.now();
  console.log('\n=== Starting File Processing Pipeline ===');
  
  try {
    console.log('\n[1/5] Validating request...');
    if (!req.file) {
      console.error('❌ No file provided in request');
      return res.status(400).json({ error: 'No file provided' });
    }
    console.log('✅ Request validation complete');

    console.log('\n[2/5] Parsing JSON file...');
    const fileContent = JSON.parse(req.file.buffer.toString());
    console.log(`✅ JSON file parsed successfully (${fileContent.length} bytes)`);

    console.log('\n[3/5] Processing drug label data...');
    const processedDrugLabel = await drugProcessor.processDrugLabel(fileContent);
    console.log('✅ Drug label processing complete');
    console.log(`  - Drug: ${processedDrugLabel.drugName}`);
    console.log(`  - Indications found: ${processedDrugLabel.indications.length}`);

    console.log('\n[4/5] Processing copay card data...');
    const processedCopayCard = drugProcessor.processCopayCard(fileContent);
    console.log('✅ Copay card processing complete');
    console.log(`  - Program: ${processedCopayCard.program_name}`);

    console.log('\n[5/5] Saving to database...');
    // Start a transaction
    const transaction = await Drug.sequelize.transaction();

    try {
      console.log('  - Creating/updating drug record...');
      // Create or update the drug
      const [drug] = await Drug.findOrCreate({
        where: { name: processedDrugLabel.drugName },
        defaults: {
          brandName: processedDrugLabel.drugName,
          manufacturer: fileContent.Manufacturers?.[0] || null
        },
        transaction
      });
      console.log(`  ✅ Drug record processed (ID: ${drug.id})`);

      // Process each indication
      console.log(`  - Processing ${processedDrugLabel.indications.length} indications...`);
      for (const indicationData of processedDrugLabel.indications) {
        // Create or update the indication
        const [indication] = await Indication.findOrCreate({
          where: {
            condition: indicationData.condition,
            icd10Code: indicationData.icd10Code
          },
          defaults: {
            condition: indicationData.condition,
            icd10Code: indicationData.icd10Code
          },
          transaction
        });

        // Create the drug-indication relationship
        await DrugIndication.findOrCreate({
          where: {
            drug_id: drug.id,
            indication_id: indication.id
          },
          defaults: {
            drug_id: drug.id,
            indication_id: indication.id
          },
          transaction
        });
        console.log(`    ✅ Processed indication: ${indicationData.condition} (ICD-10: ${indicationData.icd10Code})`);
      }

      // Commit the transaction
      await transaction.commit();
      console.log('\n✅ Database update completed successfully');

      const result = {
        drugLabel: processedDrugLabel,
        copayCard: processedCopayCard,
        timestamp: new Date().toISOString(),
        processingTime: `${Date.now() - startTime}ms`
      };

      console.log('\n=== File Processing Pipeline Completed Successfully ===');
      console.log(`Total processing time: ${Date.now() - startTime}ms\n`);
      res.json(result);
    } catch (error) {
      // If there's an error, rollback the transaction
      await transaction.rollback();
      console.error('\n❌ Error during database operations:', error);
      throw error;
    }
  } catch (error) {
    console.error('\n❌ Error in file processing pipeline:', error);
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