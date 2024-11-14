const express = require('express');
const router = express.Router();

const BookController = require('../controllers/booksController');

router.post('/add', BookController.addNewBook);
router.get('/list', BookController.listOfBooks);
router.post('/searchByAuthor', BookController.searchByAuthor);
router.post('/searchByTitle', BookController.searchByTitle);
router.put('/update/:book_id', BookController.updateBook);
router.delete('/remove', BookController.removeBook);

module.exports = router;