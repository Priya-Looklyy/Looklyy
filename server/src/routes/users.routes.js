const { Router } = require('express');
const controller = require('../controllers/users.controller');
const { authenticateJwt } = require('../middleware/auth');

const router = Router();

router.get('/me', authenticateJwt, controller.getMe);
router.put('/me', authenticateJwt, controller.updateProfile);

module.exports = router;


