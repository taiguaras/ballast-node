const { Drug, sequelize } = require('../../models');
const { setupTestDatabase } = require('../helpers/testHelper');

describe('Drug Model Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Create Drug', () => {
    it('should create a drug with valid data', async () => {
      const drugData = {
        name: 'Test Drug',
        description: 'Test drug description',
        brandName: 'Test Brand',
        manufacturer: 'Test Manufacturer',
        status: 'active'
      };
      
      const drug = await Drug.create(drugData);
      
      expect(drug).toBeDefined();
      expect(drug.id).toBeDefined();
      expect(drug.name).toBe(drugData.name);
      expect(drug.description).toBe(drugData.description);
      expect(drug.brandName).toBe(drugData.brandName);
      expect(drug.manufacturer).toBe(drugData.manufacturer);
      expect(drug.status).toBe(drugData.status);
    });

    it('should not create a drug without a name', async () => {
      const drugData = {
        description: 'Test drug description',
        brandName: 'Test Brand',
        manufacturer: 'Test Manufacturer',
        status: 'active'
      };
      
      await expect(Drug.create(drugData)).rejects.toThrow();
    });
  });

  describe('Update Drug', () => {
    it('should update a drug', async () => {
      // First create a drug
      const drug = await Drug.create({
        name: 'Drug to Update',
        description: 'Original description',
        brandName: 'Original Brand',
        manufacturer: 'Original Manufacturer',
        status: 'active'
      });
      
      // Update the drug
      drug.name = 'Updated Drug Name';
      await drug.save();
      
      // Fetch the drug again to verify the update
      const updatedDrug = await Drug.findByPk(drug.id);
      
      expect(updatedDrug.name).toBe('Updated Drug Name');
    });
  });

  describe('Delete Drug', () => {
    it('should delete a drug', async () => {
      // First create a drug
      const drug = await Drug.create({
        name: 'Drug to Delete',
        description: 'Will be deleted',
        brandName: 'Delete Brand',
        manufacturer: 'Delete Manufacturer',
        status: 'active'
      });
      
      // Delete the drug
      await drug.destroy();
      
      // Try to fetch the drug again
      const deletedDrug = await Drug.findByPk(drug.id);
      
      expect(deletedDrug).toBeNull();
    });
  });
}); 