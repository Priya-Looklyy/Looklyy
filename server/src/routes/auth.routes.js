const { Router } = require('express');
const controller = require('../controllers/auth.controller');

const router = Router();

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);

module.exports = router;


