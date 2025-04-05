const express = require('express');
const { 
  getAllIndications,
  getIndicationById,
  createIndication,
  updateIndication,
  deleteIndication
} = require('../controllers/indicationController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/indications:
 *   get:
 *     summary: Get all indications with pagination
 *     tags: [Indications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of indications
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllIndications);

/**
 * @swagger
 * /api/indications/{id}:
 *   get:
 *     summary: Get indication by ID
 *     tags: [Indications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Indication details
 *       404:
 *         description: Indication not found
 */
router.get('/:id', getIndicationById);

/**
 * @swagger
 * /api/indications:
 *   post:
 *     summary: Create a new indication
 *     tags: [Indications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - condition
 *             properties:
 *               condition:
 *                 type: string
 *               icd10Code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Indication created
 *       400:
 *         description: Bad request
 */
router.post('/', createIndication);

/**
 * @swagger
 * /api/indications/{id}:
 *   put:
 *     summary: Update an indication
 *     tags: [Indications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               condition:
 *                 type: string
 *               icd10Code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Indication updated
 *       404:
 *         description: Indication not found
 */
router.put('/:id', updateIndication);

/**
 * @swagger
 * /api/indications/{id}:
 *   delete:
 *     summary: Delete an indication
 *     tags: [Indications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Indication deleted
 *       404:
 *         description: Indication not found
 */
router.delete('/:id', deleteIndication);

module.exports = router; 