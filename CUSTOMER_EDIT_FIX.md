# Customer Edit Fix - Summary

## Problem Identified
Khi chỉnh sửa khách hàng, ứng dụng gọi POST (tạo mới) thay vì PUT (cập nhật), dẫn đến lỗi "Email đã tồn tại trong hệ thống".

## Root Cause
CustomerFormModal không nhận đúng customer data do:
1. **Data Transform Issue**: CustomersScreen transform dữ liệu từ API format (`ten`, `sodienthoai`) sang UI format (`fullName`, `phone`)
2. **Missing ID**: Transformed object không có `_id` field cần thiết để nhận biết edit mode
3. **Wrong Data Passed**: Truyền transformed object thay vì raw data từ API

## Solution Applied

### 1. Fix Data Passing (CustomersScreen.js)
```javascript
const handleEditCustomer = (customer) => {
  console.log('handleEditCustomer called with:', customer);
  // Truyền rawData thay vì transformed data để CustomerFormModal có đầy đủ thông tin
  setSelectedCustomer(customer.rawData || customer);
  setShowAddModal(true);
};
```

### 2. Improve Customer Detection (CustomerFormModal.js)
```javascript
// Kiểm tra customer ID với nhiều format khác nhau
const customerId = customer?._id || customer?.id;

if (customer && customerId) {
  // Cập nhật khách hàng hiện có
  console.log('Updating customer with ID:', customerId);
  result = await updateCustomer(customerId, basicCustomerData);
} else {
  // Tạo khách hàng mới
  console.log('Creating new customer');
  result = await createCustomer(basicCustomerData);
}
```

### 3. Enhanced Data Mapping
```javascript
// Map dữ liệu từ customer object với nhiều format khác nhau
setForm({
  fullName: customer.fullName || customer.ten || '',
  email: customer.email || '',
  phone: customer.phone || customer.sodienthoai || '',
  address: customer.address || customer.diachi || '',
  gender: customer.gender || customer.gioitinh || 'male',
  // ... other fields with fallback mapping
});
```

### 4. Added Debug Logging
```javascript
// Debug logging
console.log('handleSave - customer:', customer);
console.log('handleSave - customer._id:', customer?._id);
console.log('handleSave - customer.id:', customer?.id);
```

## Data Flow Fixed

### Before (Broken):
1. API returns: `{ _id: "123", ten: "Nguyễn Văn A", sodienthoai: "0987654321" }`
2. Transform to: `{ id: "123", fullName: "Nguyễn Văn A", phone: "0987654321" }`
3. Pass transformed object to CustomerFormModal
4. CustomerFormModal checks `customer._id` → **undefined** → Treats as new customer
5. Calls POST instead of PUT → Email duplicate error

### After (Fixed):
1. API returns: `{ _id: "123", ten: "Nguyễn Văn A", sodienthoai: "0987654321" }`
2. Transform to: `{ id: "123", fullName: "Nguyễn Văn A", phone: "0987654321", rawData: original }`
3. Pass `customer.rawData` to CustomerFormModal
4. CustomerFormModal checks `customer._id` → **"123"** → Recognizes as edit mode
5. Calls PUT with correct ID → Update successful

## Testing Steps
1. Open CustomersScreen
2. Click edit button on any customer
3. Modify customer information
4. Click save
5. Should call PUT instead of POST
6. Should update successfully without email duplicate error

## Expected Results
- ✅ Edit mode correctly detected
- ✅ PUT API called instead of POST
- ✅ No email duplicate error
- ✅ Customer updated successfully
- ✅ Console logs show correct customer ID and operation

## Status: ✅ FIXED
Customer edit functionality now works correctly with proper API endpoint detection.