const express = require('express');
const router = express.Router();
const { getMyHistory, getAllBorrowRecords } = require('../controllers/borrowController');
const verifyToken = require('../middleware/auth');
const { verifyLibrarian, verifyStudent } = require('../middleware/checkRole');

/**
 * @swagger
 * tags:
 *   name: Borrow History
 *   description: Viewing borrow records
 */

/**
 * @swagger
 * /api/books/my-history:
 *   get:
 *     summary: View current student's borrowing history
 *     tags: [Borrow History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow history records
 *       403:
 *         description: Forbidden (Student only)
 */
router.get('/books/my-history', verifyToken, verifyStudent, getMyHistory);

/**
 * @swagger
 * /api/librarian/borrow-records:
 *   get:
 *     summary: View all active and past borrow records
 *     tags: [Borrow History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All borrow records
 *       403:
 *         description: Forbidden (Librarian only)
 */
router.get('/librarian/borrow-records', verifyToken, verifyLibrarian, getAllBorrowRecords);

module.exports = router;
