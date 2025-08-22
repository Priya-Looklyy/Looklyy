const { Router } = require('express');
const controller = require('../controllers/lookboards.controller');
const { authenticateJwt } = require('../middleware/auth');

const router = Router();

router.get('/', authenticateJwt, controller.listMyLookboards);
router.post('/', authenticateJwt, controller.createLookboard);
router.get('/:id', authenticateJwt, controller.getLookboardById);
router.put('/:id', authenticateJwt, controller.updateLookboard);
router.delete('/:id', authenticateJwt, controller.deleteLookboard);

module.exports = router;


