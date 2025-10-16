# Hệ thống quản lý khách hàng và nhân viên cho Business User

## Tính năng đã hoàn thành:

### 1. BottomTabBar động theo loại tài khoản
- ✅ Business user: Hiển thị "Khách hàng" và "Nhân viên" thay vì "Dinh Dưỡng" và "Tiến Độ"
- ✅ Personal user: Hiển thị tabs thông thường

### 2. Màn hình quản lý khách hàng (CustomersScreen)
- ✅ Tìm kiếm theo tên, email, số điện thoại
- ✅ Hiển thị dạng bảng trên PC/tablet
- ✅ Hiển thị dạng thẻ có thể scroll trên mobile
- ✅ Nút FAB (floating) để thêm khách hàng mới
- ✅ Form thêm/sửa khách hàng với đầy đủ thông tin
- ✅ Dark mode support

### 3. Màn hình quản lý nhân viên (EmployeesScreen)
- ✅ Tìm kiếm theo tên, email, số điện thoại, chức vụ
- ✅ Hiển thị dạng bảng trên PC/tablet với chip chức vụ
- ✅ Hiển thị dạng thẻ có thể scroll trên mobile
- ✅ Nút FAB (floating) để thêm nhân viên mới
- ✅ Form thêm/sửa nhân viên với thông tin bổ sung (chức vụ, lương)
- ✅ Dark mode support

### 4. Form thêm/sửa với tính năng nâng cao
- ✅ Thông tin cơ bản: Họ tên, email, SĐT, địa chỉ
- ✅ Thông tin thể chất: Chiều cao, cân nặng với nút "Thêm"/"Cập nhật"
- ✅ Số đo cơ thể: Modal dialog với danh sách các bộ phận
- ✅ Nút "Thêm bộ phận" để thêm phần tử mới vào mảng JSON
- ✅ Có thể xóa từng bộ phận đã thêm

### 5. Tích hợp vào hệ thống chính
- ✅ BranchHome.tsx đã được cập nhật để detect business user
- ✅ Routing cho màn hình customers và employees
- ✅ Truyền props isDarkMode và isBusiness đúng cách

## Các file đã tạo/sửa:

1. `CustomersScreen.js` - Màn hình quản lý khách hàng
2. `EmployeesScreen.js` - Màn hình quản lý nhân viên  
3. `BottomTabBar.js` - Cập nhật để hiển thị tabs theo loại user
4. `BranchHome.tsx` - Tích hợp routing và business logic
5. `EditProfileScreen.js` - Thêm nút "Thêm"/"Cập nhật" cho thông tin thể chất và số đo

## Cách sử dụng:

1. Đăng nhập với tài khoản business
2. Bottom navigation sẽ hiển thị "Khách hàng" và "Nhân viên"
3. Tap vào từng tab để xem danh sách
4. Sử dụng ô tìm kiếm để lọc danh sách
5. Nhấn nút + (FAB) để thêm mới
6. Trong form thêm/sửa:
   - Điền thông tin cơ bản
   - Nhấn nút "Thêm"/"Cập nhật" bên cạnh "Thông tin thể chất"
   - Nhấn nút "Thêm"/"Cập nhật" bên cạnh "Số đo cơ thể" để mở modal
   - Trong modal số đo: thêm tên bộ phận + số đo, nhấn "Thêm bộ phận"
   - Xem danh sách các bộ phận đã thêm, có thể xóa từng cái

## Responsive Design:

- **Tablet/PC**: Hiển thị dạng bảng (DataTable) với đầy đủ thông tin
- **Mobile**: Hiển thị dạng thẻ (Card) có thể scroll, thông tin được sắp xếp gọn

## Dark Mode:

Tất cả màn hình đều hỗ trợ dark mode với màu sắc phù hợp:
- Background: darkBackground, darkSurface  
- Text: darkText, darkSecondary
- Accent: darkGreen
- Borders và dividers cũng được themed

## Kiểu dữ liệu:

```javascript
// Khách hàng
{
  id: string,
  fullName: string,
  email: string, 
  phone: string,
  address: string,
  height?: string,
  weight?: string,
  bodyMeasurements?: Array<{name: string, value: string}>,
  avatar: string,
  joinDate: string,
  status: 'active' | 'inactive'
}

// Nhân viên (kế thừa từ khách hàng + thêm)
{
  ...customerData,
  position: string,
  salary: string
}
```

Hệ thống đã hoàn thành đầy đủ theo yêu cầu!