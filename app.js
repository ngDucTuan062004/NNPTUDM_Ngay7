const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productRoutes);
app.use('/api/inventories', inventoryRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi',
    error: err.message,
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tìm thấy',
  });
});


app.listen(PORT, () => {
  console.log(`Server đang chạy trên http://localhost:${PORT}`);
});

module.exports = app;
