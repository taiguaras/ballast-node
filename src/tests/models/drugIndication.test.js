const { Drug, Indication, DrugIndication, sequelize } = require('../../models');
const { setupTestDatabase, createTestDrug, createTestIndication } = require('../helpers/testHelper');

describe('DrugIndication Model', () => {
  // Set up the database before each test
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('should associate a drug with an indication', async () => {
    // Create a test drug and indication
    const drug = await createTestDrug();
    const indication = await createTestIndication();

    // Create the association
    const drugIndication = await DrugIndication.create({
      drug_id: drug.id,
      indication_id: indication.id,
      status: 'active'
    });

    // Verify the association was created
    expect(drugIndication).toBeTruthy();
    expect(drugIndication.drug_id).toBe(drug.id);
    expect(drugIndication.indication_id).toBe(indication.id);
    expect(drugIndication.status).toBe('active');

    // Verify the relationship works in both directions
    const drugWithIndications = await Drug.findByPk(drug.id, {
      include: [{ model: Indication }]
    });

    expect(drugWithIndications.Indications).toBeTruthy();
    expect(drugWithIndications.Indications.length).toBe(1);
    expect(drugWithIndications.Indications[0].id).toBe(indication.id);

    const indicationWithDrugs = await Indication.findByPk(indication.id, {
      include: [{ model: Drug }]
    });

    expect(indicationWithDrugs.Drugs).toBeTruthy();
    expect(indicationWithDrugs.Drugs.length).toBe(1);
    expect(indicationWithDrugs.Drugs[0].id).toBe(drug.id);
  });

  it('should not allow duplicate associations', async () => {
    // Create a test drug and indication
    const drug = await createTestDrug();
    const indication = await createTestIndication();

    // Create the association
    await DrugIndication.create({
      drug_id: drug.id,
      indication_id: indication.id,
      status: 'active'
    });

    // Try to create a duplicate association
    try {
      await DrugIndication.create({
        drug_id: drug.id,
        indication_id: indication.id,
        status: 'inactive'
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Verify we get a duplicate error
      expect(error.name).toBe('SequelizeUniqueConstraintError');
    }
  });

  it('should update the status of an association', async () => {
    // Create a test drug and indication
    const drug = await createTestDrug();
    const indication = await createTestIndication();

    // Create the association
    const drugIndication = await DrugIndication.create({
      drug_id: drug.id,
      indication_id: indication.id,
      status: 'active'
    });

    // Update the status
    drugIndication.status = 'inactive';
    await drugIndication.save();

    // Verify the status was updated
    const updatedDrugIndication = await DrugIndication.findByPk(drugIndication.id);
    expect(updatedDrugIndication.status).toBe('inactive');
  });

  // Clean up after all tests
  afterAll(async () => {
    await sequelize.close();
  });
}); 