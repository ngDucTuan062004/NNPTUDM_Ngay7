const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Lấy tất cả inventory
router.get('/', inventoryController.getAllInventories);

// Lấy inventory theo ID
router.get('/:id', inventoryController.getInventoryById);

// Lấy inventory theo product ID
router.get('/product/:productId', inventoryController.getInventoryByProductId);

// Tăng stock
router.post('/add-stock', inventoryController.addStock);

// Giảm stock
router.post('/remove-stock', inventoryController.removeStock);

// Đặt hàng/Giữ chỗ (Reservation)
router.post('/reservation', inventoryController.reservation);

// Xác nhận bán hàng (Sold)
router.post('/sold', inventoryController.sold);

module.exports = router;
