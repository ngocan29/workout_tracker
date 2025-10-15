# API Documentation - Business User Flow

## Luồng hoạt động cho User Business

### 1. Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "business@example.com",
  "matkhau": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id_here",
    "ten": "Công ty ABC",
    "loai_tai_khoan": "business",
    "email": "business@example.com",
    "sodienthoai": "0123456789",
    "diachi": "123 Đường ABC",
    "nguoidaidien": "Nguyễn Văn A",
    "ngayvao": "2023-01-01T00:00:00.000Z",
    "chuoi": 0,
    "trangthai": "active"
  }
}
```

### 2. Lấy danh sách chi nhánh của công ty
```http
GET /api/chinhanh/my-branches
user-id: {user_id_from_login}
```

**Response:**
```json
[
  {
    "_id": "branch_id_1",
    "ten": "Chi nhánh Hà Nội",
    "diachi": "123 Phố Huế, Hà Nội",
    "congtyID": "user_id_here",
    "trangthai": "active",
    "ngaytao": "2023-01-01T00:00:00.000Z"
  }
]
```

### 3. Thêm chi nhánh mới
```http
POST /api/chinhanh/
Content-Type: application/json
user-id: {user_id_from_login}

{
  "ten": "Chi nhánh Hồ Chí Minh",
  "diachi": "456 Nguyễn Huệ, TP.HCM"
}
```

**Response:**
```json
{
  "_id": "new_branch_id",
  "ten": "Chi nhánh Hồ Chí Minh",
  "diachi": "456 Nguyễn Huệ, TP.HCM",
  "congtyID": "user_id_here",
  "trangthai": "active",
  "ngaytao": "2023-01-01T00:00:00.000Z"
}
```

### 4. Sửa thông tin chi nhánh
```http
PUT /api/chinhanh/{branch_id}
Content-Type: application/json
user-id: {user_id_from_login}

{
  "ten": "Chi nhánh TP.HCM - Quận 1",
  "diachi": "789 Lê Lợi, Quận 1, TP.HCM"
}
```

### 5. Xóa chi nhánh
```http
DELETE /api/chinhanh/{branch_id}
user-id: {user_id_from_login}
```

**Response:**
```json
{
  "message": "Branch deleted successfully"
}
```

### 6. Lấy thông tin profile
```http
GET /api/auth/profile
user-id: {user_id_from_login}
```

### 7. Cập nhật thông tin công ty
```http
PUT /api/auth/profile
Content-Type: application/json
user-id: {user_id_from_login}

{
  "ten": "Công ty ABC Corp",
  "sodienthoai": "0987654321",
  "diachi": "456 Đường DEF",
  "nguoidaidien": "Trần Thị B"
}
```

### 8. Đăng xuất
```http
POST /api/auth/logout
```

## Ghi chú quan trọng

1. **Authentication**: Hiện tại sử dụng `user-id` trong header. Sau này nên chuyển sang JWT token.

2. **Authorization**: 
   - Chỉ user có `loai_tai_khoan = "business"` mới có thể thao tác với chi nhánh
   - User chỉ có thể thao tác với chi nhánh thuộc về công ty của mình

3. **Data Security**:
   - Mật khẩu được hash bằng bcrypt trước khi lưu
   - Mật khẩu không được trả về trong response

4. **Database Relations**:
   - `ChiNhanh.congtyID` references `User._id`
   - Chỉ business user mới có chi nhánh

## Frontend Implementation

Trong frontend, sau khi đăng nhập thành công:

1. Lưu thông tin user (bao gồm `_id`) vào storage
2. Gửi `user-id` trong header cho tất cả API calls
3. Hiển thị danh sách chi nhánh với các nút CRUD
4. Implement các form để thêm/sửa chi nhánh và thông tin công ty