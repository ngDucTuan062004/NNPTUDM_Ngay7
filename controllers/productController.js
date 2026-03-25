const Product = require('../models/Product');
const { createInventoryForProduct } = require('./inventoryController');


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;


    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp name và price',
      });
    }


    const product = new Product({
      name,
      description,
      price,
    });

    await product.save();


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
