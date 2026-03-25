# Inventory Management System

Hệ thống quản lý kho hàng với các chức năng: tạo sản phẩm, quản lý tồn kho, đặt hàng, và xác nhận bán hàng.

## Cài đặt

### Yêu cầu

- Node.js (v14 hoặc cao hơn)
- MongoDB (đang chạy trên localhost:27017)

### Bước cài đặt

```bash
# Cài đặt dependencies
npm install

# Khởi động server
npm start

# Hoặc chạy với nodemon (dev mode)
npm run dev
```

Server sẽ chạy trên `http://localhost:3000`

---

## API Documentation

### 1. Products API

#### Tạo sản phẩm mới (tự động tạo inventory)

```
POST /api/products
Content-Type: application/json

{
  "name": "Laptop Dell",
  "description": "Laptop cao cấp",
  "price": 15000000
}

Response:
{
  "success": true,
  "message": "Tạo product và inventory thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop Dell",
    "description": "Laptop cao cấp",
    "price": 15000000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Lấy tất cả sản phẩm

```
GET /api/products

Response:
{
  "success": true,
  "message": "Danh sách products",
  "data": [...]
}
```

#### Lấy sản phẩm theo ID

```
GET /api/products/{productId}

Response:
{
  "success": true,
  "message": "Chi tiết product",
  "data": {...}
}
```

#### Cập nhật sản phẩm

```
PUT /api/products/{productId}
Content-Type: application/json

{
  "name": "Laptop Dell Updated",
  "price": 16000000
}
```

#### Xóa sản phẩm

```
DELETE /api/products/{productId}
```

---

### 2. Inventory API

#### Lấy tất cả inventory

```
GET /api/inventories

Response:
{
  "success": true,
  "message": "Danh sách inventory",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "product": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Laptop Dell",
        "price": 15000000
      },
      "stock": 100,
      "reserved": 10,
      "soldCount": 50,
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Lấy inventory theo ID

```
GET /api/inventories/{inventoryId}

Response:
{
  "success": true,
  "message": "Chi tiết inventory",
  "data": {...}
}
```

#### Lấy inventory theo Product ID

```
GET /api/inventories/product/{productId}

Response:
{
  "success": true,
  "message": "Chi tiết inventory theo product",
  "data": {...}
}
```

#### Tăng stock (Add Stock)

```
POST /api/inventories/add-stock
Content-Type: application/json

{
  "product": "507f1f77bcf86cd799439011",
  "quantity": 50
}

Response:
{
  "success": true,
  "message": "Tăng stock thành công, thêm 50 sản phẩm",
  "data": {
    "stock": 150,
    "reserved": 10,
    "soldCount": 50
  }
}
```

#### Giảm stock (Remove Stock)

```
POST /api/inventories/remove-stock
Content-Type: application/json

{
  "product": "507f1f77bcf86cd799439011",
  "quantity": 20
}

Response:
{
  "success": true,
  "message": "Giảm stock thành công, giảm 20 sản phẩm",
  "data": {
    "stock": 130,
    "reserved": 10,
    "soldCount": 50
  }
}
```

#### Đặt hàng (Reservation)

```
POST /api/inventories/reservation
Content-Type: application/json

{
  "product": "507f1f77bcf86cd799439011",
  "quantity": 15
}

Response:
{
  "success": true,
  "message": "Đặt hàng thành công, đã dành chỗ 15 sản phẩm",
  "data": {
    "stock": 115,
    "reserved": 25,
    "soldCount": 50
  }
}
```

#### Xác nhận bán hàng (Sold)

```
POST /api/inventories/sold
Content-Type: application/json

{
  "product": "507f1f77bcf86cd799439011",
  "quantity": 10
}

Response:
{
  "success": true,
  "message": "Xác nhận bán hàng thành công, đã bán 10 sản phẩm",
  "data": {
    "stock": 115,
    "reserved": 15,
    "soldCount": 60
  }
}
```

---

## Luồng hoạt động

### Ví dụ: Quy trình mua hàng

1. **Tạo sản phẩm** - Tự động tạo inventory với stock = 0

   ```
   POST /api/products
   { "name": "iPhone 15", "price": 20000000 }
   ```

2. **Nhập hàng** - Tăng stock

   ```
   POST /api/inventories/add-stock
   { "product": "{productId}", "quantity": 100 }
   ```

   - stock: 0 → 100
   - reserved: 0
   - soldCount: 0

3. **Khách đặt hàng** - Giữ chỗ

   ```
   POST /api/inventories/reservation
   { "product": "{productId}", "quantity": 5 }
   ```

   - stock: 100 → 95
   - reserved: 0 → 5
   - soldCount: 0

4. **Xác nhận bán** - Hoàn thành mua bán
   ```
   POST /api/inventories/sold
   { "product": "{productId}", "quantity": 5 }
   ```

   - stock: 95 (không thay đổi)
   - reserved: 5 → 0
   - soldCount: 0 → 5

---

## Model Schema

### Product

```javascript
{
  name: String (required),
  description: String,
  price: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory

```javascript
{
  product: ObjectID (ref: Product, required, unique),
  stock: Number (min: 0, default: 0),
  reserved: Number (min: 0, default: 0),
  soldCount: Number (min: 0, default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Cấu trúc thư mục

```
├── app.js                 # File khởi động ứng dụng
├── package.json          # Dependencies
├── config/
│   └── db.js            # Kết nối MongoDB
├── models/
│   ├── Product.js       # Schema sản phẩm
│   └── Inventory.js     # Schema kho hàng
├── controllers/
│   ├── productController.js    # Xử lý logic sản phẩm
│   └── inventoryController.js  # Xử lý logic kho hàng
└── routes/
    ├── product.js       # API routes sản phẩm
    └── inventory.js     # API routes kho hàng
```

---

## Tính năng chính

✅ Tạo sản phẩm và tự động tạo inventory  
✅ Quản lý tồn kho (stock)  
✅ Đặt hàng và giữ chỗ (reservation)  
✅ Xác nhận bán hàng (sold)  
✅ Join dữ liệu Product và Inventory  
✅ Validation dữ liệu đầu vào  
✅ Error handling toàn diện

---

## Ghi chú

- Khi đặt hàng (reservation), stock sẽ giảm và reserved sẽ tăng
- Khi xác nhận bán hàng (sold), reserved sẽ giảm và soldCount sẽ tăng
- Không thể giảm stock hoặc đặt hàng nếu stock không đủ
- Không thể xác nhận bán nếu reserved không đủ
