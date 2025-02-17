const express = require('express');
const router = express.Router();
const { signup, login, getUser } = require('../controllers/authController'); // ✅ Import login
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login); // ✅ Make sure this exists!
router.get('/user', authMiddleware, getUser);

module.exports = router;
