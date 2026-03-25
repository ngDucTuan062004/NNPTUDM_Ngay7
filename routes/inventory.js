const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');


router.get('/', inventoryController.getAllInventories);


router.get('/:id', inventoryController.getInventoryById);


router.get('/product/:productId', inventoryController.getInventoryByProductId);


router.post('/add-stock', inventoryController.addStock);


router.post('/remove-stock', inventoryController.removeStock);


router.post('/reservation', inventoryController.reservation);


router.post('/sold', inventoryController.sold);

module.exports = router;
