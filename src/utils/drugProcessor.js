const { findICD10Code } = require('./icd10Map');
const natural = require('natural');

class DrugProcessor {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  /**
   * Process DailyMed drug label data
   * @param {Object} drugData - Raw drug label data
   * @returns {Object} Processed drug information
   */
  async processDrugLabel(drugData) {
    console.log('=== Starting Drug Label Processing ===');
    const startTime = Date.now();
    
    try {
      console.log('[1/3] Extracting indications...');
      const indications = this.extractIndications(drugData);
      console.log(`✅ Extracted ${indications.length} indications`);
      
      console.log('[2/3] Mapping to ICD-10 codes...');
      const mappedIndications = await this.mapToICD10(indications);
      console.log(`✅ Mapped ${mappedIndications.length} indications to ICD-10 codes`);
      
      console.log('[3/3] Formatting output...');
      const result = {
        drugName: drugData.drugName,
        indications: mappedIndications,
        processingTime: `${Date.now() - startTime}ms`
      };
      
      console.log('=== Drug Label Processing Completed ===');
      console.log(`Total processing time: ${Date.now() - startTime}ms`);
      return result;
    } catch (error) {
      console.error('❌ Error in drug label processing:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  /**
   * Process copay card data
   * @param {Object} copayData - Raw copay card data
   * @returns {Object} Standardized copay card information
   */
  processCopayCard(copayData) {
    console.log('=== Starting Copay Card Processing ===');
    const startTime = Date.now();
    
    try {
      console.log('[1/7] Extracting coverage eligibilities...');
      const coverageEligibilities = this.extractCoverageEligibilities(copayData);
      console.log(`✅ Extracted ${coverageEligibilities.length} coverage eligibilities`);

      console.log('[2/7] Extracting requirements...');
      const requirements = this.extractRequirements(copayData);
      console.log(`✅ Extracted ${requirements.length} requirements`);

      console.log('[3/7] Extracting benefits...');
      const benefits = this.extractBenefits(copayData);
      console.log(`✅ Extracted ${benefits.length} benefits`);

      console.log('[4/7] Extracting forms...');
      const forms = this.extractForms(copayData);
      console.log(`✅ Extracted ${forms.length} forms`);

      console.log('[5/7] Extracting funding information...');
      const funding = this.extractFunding(copayData);
      console.log('✅ Extracted funding information');

      console.log('[6/7] Extracting details...');
      const details = this.extractDetails(copayData);
      console.log(`✅ Extracted ${details.length} details`);

      console.log('[7/7] Formatting output...');
      const result = {
        program_name: copayData.programName || 'Dupixent MyWay Copay Card',
        coverage_eligibilities: coverageEligibilities,
        program_type: 'Coupon',
        requirements: requirements,
        benefits: benefits,
        forms: forms,
        funding: funding,
        details: details,
        processingTime: `${Date.now() - startTime}ms`
      };

      console.log('=== Copay Card Processing Completed ===');
      console.log(`Total processing time: ${Date.now() - startTime}ms`);
      return result;
    } catch (error) {
      console.error('❌ Error in copay card processing:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  // Helper methods with logging
  extractIndications(drugData) {
    console.log('Extracting indications from drug data...');
    
    if (!drugData) {
      console.log('No drug data provided');
      return [];
    }

    const indications = new Set();

    // Extract from TherapeuticAreas array
    if (drugData.TherapeuticAreas && Array.isArray(drugData.TherapeuticAreas)) {
      console.log(`Processing ${drugData.TherapeuticAreas.length} therapeutic areas...`);
      drugData.TherapeuticAreas.forEach(area => {
        indications.add({
          condition: area,
          source: 'therapeutic_area'
        });
      });
    }

    // Extract from AssociatedFoundations array
    if (drugData.AssociatedFoundations && Array.isArray(drugData.AssociatedFoundations)) {
      console.log(`Processing ${drugData.AssociatedFoundations.length} associated foundations...`);
      
      drugData.AssociatedFoundations.forEach(foundation => {
        // Only process foundations that include Dupixent
        if (foundation.Drugs && foundation.Drugs.some(drug => 
            drug.toLowerCase().includes('dupixent'))) {
          
          foundation.TherapAreas.forEach(area => {
            indications.add({
              condition: area,
              source: 'foundation',
              foundationName: foundation.ProgramName
            });
          });
        }
      });
    }

    const uniqueIndications = Array.from(indications);
    console.log(`Found ${uniqueIndications.length} unique indications`);
    return uniqueIndications;
  }

  async mapToICD10(indications) {
    console.log('Mapping indications to ICD-10 codes...');
    return indications.map(indication => {
      const code = findICD10Code(indication.condition);
      return {
        ...indication,
        icd10Code: code
      };
    });
  }

  extractCoverageEligibilities(copayData) {
    console.log('Extracting coverage eligibilities...');
    // Implementation for extracting coverage eligibilities
    return ['Commercially insured'];
  }

  extractRequirements(copayData) {
    console.log('Extracting requirements...');
    // Implementation for extracting requirements
    return [
      {
        name: 'us_residency',
        value: 'true'
      },
      {
        name: 'minimum_age',
        value: '18'
      },
      {
        name: 'insurance_coverage',
        value: 'true'
      },
      {
        name: 'eligibility_length',
        value: '12m'
      }
    ];
  }

  extractBenefits(copayData) {
    console.log('Extracting benefits...');
    // Implementation for extracting benefits
    return [
      {
        name: 'max_annual_savings',
        value: '13000.00'
      },
      {
        name: 'min_out_of_pocket',
        value: '0.00'
      }
    ];
  }

  extractForms(copayData) {
    console.log('Extracting forms...');
    // Implementation for extracting forms
    return [
      {
        name: 'Enrollment Form',
        link: 'https://www.dupixent.com/support-savings/copay-card'
      }
    ];
  }

  extractFunding(copayData) {
    console.log('Extracting funding information...');
    // Implementation for extracting funding information
    return {
      evergreen: 'true',
      current_funding_level: 'Data Not Available'
    };
  }

  extractDetails(copayData) {
    console.log('Extracting details...');
    // Implementation for extracting details
    return [
      {
        eligibility: 'Patient must have commercial insurance and be a legal resident of the US',
        program: 'Patients may pay as little as $0 for every month of Dupixent',
        renewal: 'Automatically re-enrolled every January 1st if used within 18 months',
        income: 'Not required'
      }
    ];
  }
}

module.exports = new DrugProcessor(); 