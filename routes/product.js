const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Tạo product mới
router.post('/', productController.createProduct);

// Lấy tất cả products
router.get('/', productController.getAllProducts);

// Lấy product theo ID
router.get('/:id', productController.getProductById);

// Cập nhật product
router.put('/:id', productController.updateProduct);

// Xóa product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
