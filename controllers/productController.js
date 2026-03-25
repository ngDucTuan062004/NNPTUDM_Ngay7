const Product = require('../models/Product');
const { createInventoryForProduct } = require('./inventoryController');

// Tạo product mới (tự động tạo inventory tương ứng)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp name và price',
      });
    }

    // Tạo product mới
    const product = new Product({
      name,
      description,
      price,
    });

    await product.save();

    // Tự động tạo inventory tương ứng
    await createInventoryForProduct(product._id);

    res.status(201).json({
      success: true,
      message: 'Tạo product và inventory thành công',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo product',
      error: error.message,
    });
  }
};

// Lấy tất cả products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: 'Danh sách products',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách products',
      error: error.message,
    });
  }
};

// Lấy product theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chi tiết product',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy product',
      error: error.message,
    });
  }
};

// Cập nhật product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật product thành công',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật product',
      error: error.message,
    });
  }
};

// Xóa product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa product thành công',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa product',
      error: error.message,
    });
  }
};
