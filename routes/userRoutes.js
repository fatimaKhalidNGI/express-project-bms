const express = require('express');
const router = express.Router();

const { verifyJWT, authAdmin } = require('../middleware/userAuth');
const UserController = require('../controllers/userController');

router.use(verifyJWT);

router.get('/listAll', authAdmin, UserController.listAllUsers);
router.get('/listAdmins', authAdmin, UserController.listAdmins);
router.get('/listUsers', authAdmin, UserController.listUsers);
router.put('/update/:user_id', authAdmin, UserController.updateUserDetails);
router.delete('/remove', authAdmin, UserController.removeUser);

module.exports = router;