const { Router } = require('express');
const controller = require('../controllers/brands.controller');
const { authenticateJwt } = require('../middleware/auth');

const router = Router();

router.get('/', authenticateJwt, controller.listBrands);
router.get('/:id', authenticateJwt, controller.getBrandById);
router.post('/', authenticateJwt, controller.createBrand);

module.exports = router;


