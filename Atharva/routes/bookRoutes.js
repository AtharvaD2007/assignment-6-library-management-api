const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { borrowBook, returnBook } = require('../controllers/borrowController');
const verifyToken = require('../middleware/auth');
const { verifyLibrarian, verifyStudent } = require('../middleware/checkRole');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book catalog and inventory
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: List books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get single book details
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               category:
 *                 type: string
 *               totalCopies:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created
 *       403:
 *         description: Forbidden (Librarian only)
 */
router.post('/', verifyToken, verifyLibrarian, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book details
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               totalCopies:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated
 *       403:
 *         description: Forbidden
 */
router.put('/:id', verifyToken, verifyLibrarian, updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Remove book from catalog
 *     tags: [Books]
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
 *         description: Book deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', verifyToken, verifyLibrarian, deleteBook);

/**
 * @swagger
 * /api/books/{id}/borrow:
 *   post:
 *     summary: Borrow a copy of a book
 *     tags: [Books]
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
 *         description: Book borrowed successfully
 *       403:
 *         description: Forbidden (Student only)
 */
router.post('/:id/borrow', verifyToken, verifyStudent, borrowBook);

/**
 * @swagger
 * /api/books/{id}/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Books]
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
 *         description: Book returned successfully
 *       403:
 *         description: Forbidden (Student only)
 */
router.post('/:id/return', verifyToken, verifyStudent, returnBook);

module.exports = router;
