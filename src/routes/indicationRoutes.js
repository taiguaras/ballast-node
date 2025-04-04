const express = require('express');
const { 
  getAllIndications,
  getIndicationById,
  createIndication,
  updateIndication,
  deleteIndication,
  incrementOccurrences
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: integer
 *               metadata:
 *                 type: object
 *               source:
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *               priority:
 *                 type: integer
 *               metadata:
 *                 type: object
 *               source:
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

/**
 * @swagger
 * /api/indications/{id}/occurrences:
 *   patch:
 *     summary: Increment indication occurrences
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Occurrences updated
 *       404:
 *         description: Indication not found
 */
router.patch('/:id/occurrences', incrementOccurrences);

module.exports = router; 