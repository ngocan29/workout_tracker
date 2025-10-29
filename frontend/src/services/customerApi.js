import { API_BASE_URL } from '../constants/api';

/**
 * Customer API Service
 * Xử lý các API calls liên quan đến khách hàng
 */

// Lấy danh sách khách hàng cho Business (tất cả khách hàng trong chi nhánh)
export const getCustomersByBranch = async (chinhanhID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/khachhang/${chinhanhID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customers for business:', error);
    throw error;
  }
};

// Lấy danh sách khách hàng cho Nhân viên (chỉ khách hàng được phân công)
export const getCustomersByEmployee = async (nhanvienID, chinhanhID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/khachhang/nhanvien/${nhanvienID}/${chinhanhID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customers for employee:', error);
    throw error;
  }
};

// Lấy danh sách khách hàng dựa trên vai trò người dùng
export const getCustomers = async (userRole, userID, chinhanhID) => {
  try {
    if (userRole === 'business') {
      return await getCustomersByBranch(chinhanhID);
    } else if (userRole === 'nhanvien') {
      return await getCustomersByEmployee(userID, chinhanhID);
    } else {
      throw new Error('Invalid user role');
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Tạo khách hàng mới - chỉ thông tin cơ bản
export const createCustomer = async (customerData) => {
  try {
    // Chỉ gửi thông tin cơ bản lên server
    const basicInfo = {
      fullName: customerData.ten || customerData.fullName,
      email: customerData.email,
      phone: customerData.sodienthoai || customerData.phone,
      address: customerData.diachi || customerData.address,
      gender: customerData.gioitinh || customerData.gender,
      password: customerData.matkhau || customerData.password,
      assignedEmployeeId: customerData.additional_info?.nhanvienUserID || customerData.assignedEmployeeId,
      chinhanhID: customerData.additional_info?.chinhanhID || customerData.chinhanhID
    };
    
    const response = await fetch(`${API_BASE_URL}/users/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basicInfo),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Cập nhật thông tin khách hàng - chỉ thông tin cơ bản
export const updateCustomer = async (customerID, customerData) => {
  try {
    console.log('updateCustomer API - customerData received:', customerData);
    
    // Chỉ gửi thông tin cơ bản lên server
    const basicInfo = {
      fullName: customerData.ten || customerData.fullName,
      email: customerData.email,
      phone: customerData.sodienthoai || customerData.phone,
      address: customerData.diachi || customerData.address,
      gender: customerData.gioitinh || customerData.gender,
      assignedEmployeeId: customerData.additional_info?.nhanvienUserID || customerData.assignedEmployeeId,
      // Thêm loai_tai_khoan để tránh validation error
      loai_tai_khoan: customerData.loai_tai_khoan
    };
    
    // Chỉ thêm password nếu có
    if (customerData.matkhau || customerData.password) {
      basicInfo.password = customerData.matkhau || customerData.password;
    }
    
    console.log('updateCustomer API - sending basicInfo:', basicInfo);
    
    const response = await fetch(`${API_BASE_URL}/users/customer/${customerID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basicInfo),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Xóa khách hàng
export const deleteCustomer = async (customerID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/customer/${customerID}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Tìm kiếm khách hàng theo email
export const searchCustomerByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/search?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching customer by email:', error);
    throw error;
  }
};
