# Hướng dẫn Test Luồng Business User

## Chuẩn bị môi trường

### 1. Backend
```bash
cd c:\prj3\workout_tracker\backend
node server.js
```
Server sẽ chạy trên: http://localhost:3000

### 2. Frontend
```bash  
cd c:\prj3\workout_tracker\frontend
npx expo start
```

## Luồng Test Business User

### Bước 1: Đăng ký tài khoản business
1. Mở app → Nhấn "Người dùng mới? Tạo tài khoản"
2. Chọn "Tài khoản doanh nghiệp"
3. Nhập thông tin:
   - Tên công ty: "ABC Company"
   - Địa chỉ: "123 Đường ABC, Quận 1, TP.HCM"
   - Mã số thuế: "123456789"
   - Người đại diện: "Nguyễn Văn A"
   - Số điện thoại: "0901234567"
   - Email: "test@business.com"
   - Mật khẩu: "123456"

### Bước 2: Đăng nhập  
1. Email: "test@business.com"
2. Mật khẩu: "123456"
3. Nhấn "Đăng Nhập"
4. Sẽ được chuyển đến MainScreen

### Bước 3: Test các chức năng trên MainScreen
1. **Xem danh sách chi nhánh**: Hiển thị danh sách chi nhánh của công ty
2. **Thêm chi nhánh**: 
   - Nhấn "Thêm chi nhánh"
   - Nhập tên: "Chi nhánh Quận 1"
   - Nhập địa chỉ: "456 Đường XYZ, Quận 1"
3. **Sửa chi nhánh**:
   - Nhấn "Sửa" trên một chi nhánh
   - Cập nhật thông tin
4. **Xóa chi nhánh**:
   - Nhấn "Xóa" trên một chi nhánh
   - Xác nhận xóa
5. **Chỉnh sửa thông tin công ty**:
   - Nhấn "Chỉnh sửa hồ sơ"
   - Cập nhật thông tin công ty
6. **Đăng xuất**:
   - Nhấn "Đăng xuất"
   - Quay về màn hình login

## API Endpoints được sử dụng

### Auth APIs
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile

### Branch APIs
- `GET /api/chinhanh/my-branches` - Lấy chi nhánh của user
- `POST /api/chinhanh` - Thêm chi nhánh
- `PUT /api/chinhanh/:id` - Cập nhật chi nhánh  
- `DELETE /api/chinhanh/:id` - Xóa chi nhánh

## Headers cần thiết
Tất cả API calls (trừ login/register) cần header:
```
user-id: <userId từ AsyncStorage>
Content-Type: application/json
```

## Dữ liệu sample để test

### User business mẫu:
```json
{
  "ten": "ABC Company",
  "loai_tai_khoan": "business", 
  "email": "test@business.com",
  "sodienthoai": "0901234567",
  "diachi": "123 Đường ABC, Quận 1, TP.HCM",
  "nguoidaidien": "Nguyễn Văn A",
  "matkhau": "123456"
}
```

### Chi nhánh mẫu:
```json
{
  "ten": "Chi nhánh Quận 1",
  "diachi": "456 Đường XYZ, Quận 1, TP.HCM"
}
```

## Các lỗi có thể gặp

### 1. Lỗi kết nối API
- Kiểm tra BASE_URL trong `constants/api.js`
- Đảm bảo backend server đã chạy trên port 3000

### 2. Lỗi CORS
- Thêm CORS headers trong backend server

### 3. Lỗi MongoDB
- Đảm bảo MongoDB đang chạy
- Kiểm tra connection string trong `backend/db.js`

## Debugging

### 1. Kiểm tra logs
```bash
# Backend logs
cd backend && node server.js

# Frontend logs  
cd frontend && npx expo start
```

### 2. Kiểm tra AsyncStorage
Trong app, có thể console.log để kiểm tra:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check current user data
AsyncStorage.getItem('userData').then(data => console.log('User data:', data));
AsyncStorage.getItem('userId').then(id => console.log('User ID:', id));
```

### 3. Test API bằng Postman
```bash
# Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@business.com",
  "matkhau": "123456"
}

# Get branches (cần userId từ login response)
GET http://localhost:3000/api/chinhanh/my-branches
user-id: <userId>
```