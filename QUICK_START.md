# Hướng dẫn nhanh - Quick Start

## 1. Cài đặt MongoDB

Đảm bảo MongoDB đang chạy trên `mongodb://localhost:27017`

Nếu chưa cài MongoDB, download tại: https://www.mongodb.com/try/download/community

## 2. Cài đặt packages

```bash
npm install
```

## 3. Khởi động server

```bash
npm start
```

Server sẽ chạy trên http://localhost:3000

## 4. Test APIs

### Tạo sản phẩm mới

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Điện thoại cao cấp",
    "price": 20000000
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Tạo product và inventory thành công",
  "data": {
    "_id": "67890abcdef123456789abcd",
    "name": "iPhone 15",
    "description": "Điện thoại cao cấp",
    "price": 20000000
  }
}
```

Lưu lại `_id` để dùng cho các API khác.

### Lấy tất cả sản phẩm

```bash
curl http://localhost:3000/api/products
```

### Lấy tất cả inventory

```bash
curl http://localhost:3000/api/inventories
```

### Nhập hàng (Tăng stock)

```bash
curl -X POST http://localhost:3000/api/inventories/add-stock \
  -H "Content-Type: application/json" \
  -d '{
    "product": "67890abcdef123456789abcd",
    "quantity": 50
  }'
```

### Đặt hàng (Reservation)

```bash
curl -X POST http://localhost:3000/api/inventories/reservation \
  -H "Content-Type: application/json" \
  -d '{
    "product": "67890abcdef123456789abcd",
    "quantity": 5
  }'
```

### Xác nhận bán (Sold)

```bash
curl -X POST http://localhost:3000/api/inventories/sold \
  -H "Content-Type: application/json" \
  -d '{
    "product": "67890abcdef123456789abcd",
    "quantity": 5
  }'
```

---

## Cấu trúc dữ liệu

### Stock Flow

```
Nhập hàng (add-stock)
    ↓
Khách đặt hàng (reservation) - stock ↓, reserved ↑
    ↓
Xác nhận bán (sold) - reserved ↓, soldCount ↑
```

### Ví dụ thực tế

```
Ban đầu:         stock: 50, reserved: 0, soldCount: 0
Sau reservation: stock: 45, reserved: 5, soldCount: 0
Sau sold:        stock: 45, reserved: 0, soldCount: 5
```

---

Xem file `API_DOCUMENTATION.md` để có tài liệu chi tiết đầy đủ.
