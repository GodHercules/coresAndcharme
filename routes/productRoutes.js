const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/cadastro-de-produtos', productController.isAuthenticated, productController.getProducts);
router.post('/cadastro-de-produtos', productController.isAuthenticated, productController.createProduct);
router.get('/editar-produto/:id', productController.isAuthenticated, productController.getEditProduct);
router.post('/editar-produto/:id', productController.isAuthenticated, productController.editProduct);
router.post('/deletar-produto/:id', productController.isAuthenticated, productController.deleteProduct);

module.exports = router;
