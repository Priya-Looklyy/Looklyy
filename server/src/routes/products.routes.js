const { Router } = require('express');
const controller = require('../controllers/products.controller');
const { authenticateJwt } = require('../middleware/auth');

const router = Router();

router.get('/', authenticateJwt, controller.listProducts);
router.post('/', authenticateJwt, controller.createProduct);
router.get('/:id', authenticateJwt, controller.getProductById);
router.put('/:id', authenticateJwt, controller.updateProduct);
router.delete('/:id', authenticateJwt, controller.deleteProduct);

module.exports = router;

