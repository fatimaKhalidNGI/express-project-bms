const express = require('express');
const router = express.Router();

const { verifyJWT, authAdmin, authUser } = require('../middleware/userAuth');
const RequestNewBooks = require('../controllers/unavailableBooksController');

router.use(verifyJWT);
router.post('/request', authUser, RequestNewBooks.makeBookRequest);
router.get('/list', authAdmin,RequestNewBooks.getRequestList_admin);
router.get('/userList', authUser, RequestNewBooks.getOwnRequests);
router.put('/respond', authAdmin, RequestNewBooks.respondAdmin);


module.exports = router;
