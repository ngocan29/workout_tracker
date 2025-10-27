# Add Workout Screen Documentation

## 📋 **Tổng quan chức năng**

AddWorkoutScreen là màn hình form để tạo bài tập mới với đầy đủ thông tin cần thiết.

## 🎯 **Các trường dữ liệu**

### **Thông tin cơ bản:**
- **Tên bài tập** *(required)*: Tên hiển thị của bài tập
- **Ảnh minh họa**: URL hình ảnh minh họa
- **Mô tả**: Mô tả chi tiết về bài tập  
- **Thời gian (phút)**: Thời gian thực hiện bài tập
- **Calories tiêu thụ**: Số calories đốt cháy ước tính
- **Hẹn giờ mỗi ngày**: Thời gian nhắc nhở hàng ngày
- **Danh mục**: Loại bài tập (Cardio, Tạ, Yoga, HIIT, etc.)

### **Chi tiết bài tập:**
- **Các bước thực hiện**: Danh sách hướng dẫn từng bước
- **Lợi ích**: Danh sách các lợi ích của bài tập

## 🔧 **Technical Implementation**

### **Form State Management:**
```javascript
const [formData, setFormData] = useState({
  ten: '',                      // Tên bài tập
  anhminhhoa: '',              // URL ảnh minh họa  
  mota: '',                    // Mô tả
  thoigiangoc: 30,            // Thời gian (phút)
  hengiomoinghay: '',         // Hẹn giờ mỗi ngày
  calotieuthukhoiluong: 0,    // Calories tiêu thụ
  cacbuoc: [''],              // Mảng các bước
  loiich: [''],               // Mảng lợi ích
  danhmuc: 'cardio',          // Danh mục
});
```

### **Dynamic Arrays:**
- **Steps (cacbuoc)**: Add/Remove/Update các bước thực hiện
- **Benefits (loiich)**: Add/Remove/Update các lợi ích

### **User ID Logic:**
```javascript
// Xác định user ID dựa trên loại tài khoản
if (user.loai_tai_khoan === 'business') {
  if (user.additional_info?.vai_tro === 'nhanvien') {
    workoutData.nhanvienUserID = user._id;
  } else {
    workoutData.userID = user._id;
  }
} else if (user.loai_tai_khoan === 'personal') {
  if (user.additional_info?.vai_tro === 'khachhang') {
    workoutData.khachhangUserID = user._id;
  } else {
    workoutData.userID = user._id;
  }
}
```

## 📱 **UI Components**

### **Form Layout:**
- **ScrollView**: Cuộn toàn màn hình để hiển thị toàn bộ form
- **Fixed Save Button**: Nút lưu cố định ở bottom
- **Modal Picker**: Category picker trong modal

### **Dynamic Lists:**
- **Steps**: Numbered list với add/remove functionality
- **Benefits**: Bullet list với add/remove functionality
- **Visual Feedback**: Step numbers và bullet points

## 🚀 **Validation & Defaults**

### **Required Fields:**
- Tên bài tập phải có giá trị

### **Default Values:**
```javascript
{
  trangthai: 'chuahoanthanh',     // Trạng thái mặc định
  thongke: 0,                     // Thống kê ban đầu
  ngaytao: new Date().toISOString(), // Ngày tạo
  // Các trường empty sẽ được set thành " " thay vì null
}
```

### **Empty Field Handling:**
- Các trường bắt buộc nhưng để trống → set thành `" "`
- Arrays rỗng → set thành `[" "]`

## 🛣️ **Navigation Flow**

```
WorkoutScreen 
    ↓ (Click "Thêm Mới")
AddWorkoutScreen
    ↓ (Save Success)
Back to WorkoutScreen
```

## 📡 **API Integration**

### **Endpoint:**
- `POST /baitap` - Tạo bài tập mới

### **Service:**
```javascript
import { WorkoutService } from '../services/api';

const response = await WorkoutService.createWorkout(workoutData);
```

## 🎨 **UI Features**

### **Interactive Elements:**
- **Add/Remove Buttons**: Plus/Trash icons cho dynamic arrays
- **Category Modal**: Sleek picker modal
- **Loading States**: Button disabled during save
- **Form Validation**: Real-time error feedback

### **Visual Design:**
- **Consistent Spacing**: Proper margins và padding
- **Color Scheme**: Colors từ constants
- **Typography**: Clear labels và readable text
- **Icons**: Feather icons cho actions

## ✅ **Success Flow**
1. User điền form với thông tin bài tập
2. Validate required fields
3. Determine user ID based on account type  
4. Call API để save workout
5. Show success alert
6. Navigate back to WorkoutScreen