const Inventory = require('../models/Inventory');
const Product = require('../models/Product');


exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    res.status(200).json({
      success: true,
      message: 'Danh sách inventory',
      data: inventories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách inventory',
      error: error.message,
    });
  }
};


exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findById(id).populate('product');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chi tiết inventory',
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết inventory',
      error: error.message,
    });
  }
};


exports.getInventoryByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.findOne({ product: productId }).populate('product');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory không tìm thấy cho product này',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chi tiết inventory theo product',
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy inventory theo product',
      error: error.message,
    });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;


    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity > 0',
      });
    }


    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product không tìm thấy',
      });
    }

   
    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { $inc: { stock: quantity } },
      { new: true }
    ).populate('product');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: `Tăng stock thành công, thêm ${quantity} sản phẩm`,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tăng stock',
      error: error.message,
    });
  }
};


exports.removeStock = async (req, res) => {
  try {
    const { product, quantity } = req.body;


    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity > 0',
      });
    }


    const currentInventory = await Inventory.findOne({ product });
    if (!currentInventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory không tìm thấy',
      });
    }


    if (currentInventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock không đủ. Hiện tại: ${currentInventory.stock}, yêu cầu: ${quantity}`,
      });
    }


    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { $inc: { stock: -quantity } },
      { new: true }
    ).populate('product');

    res.status(200).json({
      success: true,
      message: `Giảm stock thành công, giảm ${quantity} sản phẩm`,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi giảm stock',
      error: error.message,
    });
  }
};


exports.reservation = async (req, res) => {
  try {
    const { product, quantity } = req.body;


    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity > 0',
      });
    }


    const currentInventory = await Inventory.findOne({ product });
    if (!currentInventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory không tìm thấy',
      });
    }


    if (currentInventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock không đủ để đặt hàng. Hiện tại: ${currentInventory.stock}, yêu cầu: ${quantity}`,
      });
    }


    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { 
        $inc: { stock: -quantity, reserved: quantity } 
      },
      { new: true }
    ).populate('product');

    res.status(200).json({
      success: true,
      message: `Đặt hàng thành công, đã dành chỗ ${quantity} sản phẩm`,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt hàng',
      error: error.message,
    });
  }
};


exports.sold = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product và quantity > 0',
      });
    }


    const currentInventory = await Inventory.findOne({ product });
    if (!currentInventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory không tìm thấy',
      });
    }


    if (currentInventory.reserved < quantity) {
      return res.status(400).json({
        success: false,
        message: `Đơn đặt hàng không đủ. Hiện tại: ${currentInventory.reserved}, yêu cầu: ${quantity}`,
      });
    }


    const inventory = await Inventory.findOneAndUpdate(
      { product },
      { 
        $inc: { reserved: -quantity, soldCount: quantity } 
      },
      { new: true }
    ).populate('product');

    res.status(200).json({
      success: true,
      message: `Xác nhận bán hàng thành công, đã bán ${quantity} sản phẩm`,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận bán hàng',
      error: error.message,
    });
  }
};


exports.createInventoryForProduct = async (productId) => {
  try {

    const existingInventory = await Inventory.findOne({ product: productId });
    if (existingInventory) {
      return existingInventory;
    }


    const inventory = new Inventory({
      product: productId,
      stock: 0,
      reserved: 0,
      soldCount: 0,
    });

    await inventory.save();
    return inventory;
  } catch (error) {
    console.error('Lỗi khi tạo inventory cho product:', error);
    throw error;
  }
};
