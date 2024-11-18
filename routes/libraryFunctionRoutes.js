const express = require('express');
const router = express.Router();

const { verifyJWT, authUser } = require('../middleware/userAuth');
const LibraryFunctions = require('../controllers/libraryFunctionController');

router.use(verifyJWT);

router.put('/borrow', authUser, LibraryFunctions.borrowBook);
router.put('/return', authUser, LibraryFunctions.returnBook);
router.get('/reminders', authUser, LibraryFunctions.returnReminder)

module.exports = router;
