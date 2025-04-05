// Simple ICD-10 mapping for common conditions
const icd10Map = {
  // Dermatologic conditions
  'Atopic Dermatitis': 'L20.9',
  'Eczema': 'L20.9',
  'Chronic Rhinosinusitis with Nasal Polyps': 'J33.9',
  'Asthma': 'J45.909',
  'Eosinophilic Esophagitis': 'K20.0',
  'Prurigo Nodularis': 'L28.1',
  
  // Common synonyms
  'Atopic Eczema': 'L20.9',
  'AD': 'L20.9',
  'CRSwNP': 'J33.9',
  'EoE': 'K20.0',
  'PN': 'L28.1',
  "Hypertension": "I10",
  "Diabetes": "E11.9"
};

/**
 * Find ICD-10 code for a given condition
 * @param {string} condition - The medical condition to look up
 * @returns {string} The ICD-10 code or a default code if not found
 */
function findICD10Code(condition) {
  if (!condition) {
    return 'R69'; // Illness, unspecified
  }

  // Normalize the condition name
  const normalizedCondition = condition.trim().toLowerCase();
  
  // Find exact match
  for (const [key, value] of Object.entries(icd10Map)) {
    if (key.toLowerCase() === normalizedCondition) {
      return value;
    }
  }
  
  // Find partial match
  for (const [key, value] of Object.entries(icd10Map)) {
    if (normalizedCondition.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedCondition)) {
      return value;
    }
  }
  
  // If no match is found, return a default code
  return 'R69'; // Illness, unspecified
}

module.exports = {
  findICD10Code,
  icd10Map
}; 