# CustomerFormModal Component

## Mô tả
Component CustomerFormModal là một modal form tái sử dụng để thêm và chỉnh sửa thông tin khách hàng. Component này đã được tách ra từ CustomersScreen để có thể sử dụng chung cho nhiều màn hình khác nhau.

## Tính năng
- ✅ Form thêm khách hàng mới
- ✅ Form chỉnh sửa thông tin khách hàng hiện có
- ✅ Validation đầy đủ cho các trường bắt buộc
- ✅ Hỗ trợ dark mode
- ✅ Giao diện responsive và nhất quán với thiết kế tổng thể
- ✅ Quản lý thông tin cơ bản (tên, email, SĐT, địa chỉ, giới tính, ngày sinh)
- ✅ Quản lý thông tin thể chất (chiều cao, cân nặng, mục tiêu tập luyện)
- ✅ Quản lý thông tin liên hệ khẩn cấp
- ✅ Quản lý số đo cơ thể với sub-modal
- ✅ Ghi chú y tế

## Cách sử dụng

### Import
```javascript
import CustomerFormModal from '../components/CustomerFormModal';
```

### Props
- `visible` (boolean, required): Hiển thị/ẩn modal
- `customer` (object, optional): 
  - `null` để thêm khách hàng mới
  - Object chứa thông tin khách hàng để chỉnh sửa
- `isDarkMode` (boolean, required): Chế độ dark mode
- `onClose` (function, required): Callback khi đóng modal
- `onSave` (function, required): Callback khi lưu thông tin khách hàng

### Ví dụ sử dụng

#### Thêm khách hàng mới:
```javascript
<CustomerFormModal
  visible={showAddModal}
  customer={null}
  isDarkMode={isDarkMode}
  onClose={() => setShowAddModal(false)}
  onSave={(customerData) => {
    // Handle save new customer
    console.log('New customer:', customerData);
    setShowAddModal(false);
  }}
/>
```

#### Chỉnh sửa khách hàng:
```javascript
<CustomerFormModal
  visible={showEditModal}
  customer={selectedCustomer}
  isDarkMode={isDarkMode}
  onClose={() => setShowEditModal(false)}
  onSave={(customerData) => {
    // Handle update customer
    console.log('Updated customer:', customerData);
    setShowEditModal(false);
  }}
/>
```

## Cấu trúc dữ liệu

### Customer Object
```javascript
{
  id: string|number,           // ID khách hàng
  fullName: string,            // Họ và tên (bắt buộc)
  email: string,               // Email (bắt buộc)
  phone: string,               // Số điện thoại (bắt buộc)
  address: string,             // Địa chỉ (bắt buộc)
  gender: 'male'|'female', // Giới tính
  height: string,              // Chiều cao (cm)
  weight: string,              // Cân nặng (kg)
  emergencyContact: string,    // Tên người liên hệ khẩn cấp
  emergencyPhone: string,      // SĐT khẩn cấp
  medicalNotes: string,        // Ghi chú y tế
  fitnessGoal: string,         // Mục tiêu tập luyện
  bodyMeasurements: Array,     // Mảng các số đo cơ thể
  avatar: string,              // URL avatar
  joinDate: string,            // Ngày tham gia
  assignedTo: string           // Nhân viên phụ trách
}
```

### Body Measurements Array
```javascript
[
  {
    name: string,              // Tên bộ phận (VD: "Vòng ngực")
    value: string              // Số đo (VD: "95")
  }
]
```

## Validation Rules
- **Họ và tên**: Bắt buộc, không được để trống
- **Email**: Bắt buộc, phải đúng định dạng email
- **Số điện thoại**: Bắt buộc, 10-11 chữ số
- **Địa chỉ**: Bắt buộc, không được để trống
- **Chiều cao**: Tùy chọn, nếu có thì phải là số dương
- **Cân nặng**: Tùy chọn, nếu có thì phải là số dương

## Tích hợp hiện tại
Component này hiện đang được sử dụng trong:
1. **CustomersScreen**: Quản lý danh sách khách hàng
2. **AddEditLichHen**: Thêm khách hàng mới khi tạo lịch hẹn

## Styling
Component sử dụng cùng một bộ styles với CustomersScreen để đảm bảo tính nhất quán:
- Card-based layout với borders và margins chuẩn
- Input styling với borderRadius 8px
- Consistent color scheme hỗ trợ dark mode
- Typography hierarchy rõ ràng