import { API_BASE_URL } from '../constants/api';

// Lấy danh sách nhân viên theo chi nhánh
export const getEmployeesByBranch = async (chinhanhID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/nhanvien/${chinhanhID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching employees by branch:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Tạo nhân viên mới
export const createEmployee = async (employeeData) => {
  try {
    // Map data format from frontend to API
    const apiData = {
      fullName: employeeData.ten || employeeData.fullName,
      email: employeeData.email,
      phone: employeeData.sodienthoai || employeeData.phone,
      address: employeeData.diachi || employeeData.address,
      gender: employeeData.gioitinh || employeeData.gender,
      password: employeeData.matkhau || employeeData.password,
      position: employeeData.additional_info?.position || employeeData.position,
      salary: employeeData.additional_info?.salary || employeeData.salary,
      chinhanhID: employeeData.additional_info?.chinhanhID || employeeData.chinhanhID,
      loai_tai_khoan: 'business'
    };

    console.log('Creating employee with data:', apiData);

    const response = await fetch(`${API_BASE_URL}/users/employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.employee || data
    };
  } catch (error) {
    console.error('Error creating employee:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    // Map data format from frontend to API
    const apiData = {
      fullName: employeeData.ten || employeeData.fullName,
      email: employeeData.email,
      phone: employeeData.sodienthoai || employeeData.phone,
      address: employeeData.diachi || employeeData.address,
      gender: employeeData.gioitinh || employeeData.gender,
      position: employeeData.additional_info?.position || employeeData.position,
      salary: employeeData.additional_info?.salary || employeeData.salary,
      loai_tai_khoan: 'business'
    };

    // Only include password if it's provided
    if (employeeData.matkhau || employeeData.password) {
      apiData.password = employeeData.matkhau || employeeData.password;
    }

    console.log('Updating employee with data:', apiData);

    const response = await fetch(`${API_BASE_URL}/users/employee/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.employee || data
    };
  } catch (error) {
    console.error('Error updating employee:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Xóa nhân viên
export const deleteEmployee = async (employeeId) => {
  try {
    console.log('Deleting employee with ID:', employeeId);

    const response = await fetch(`${API_BASE_URL}/users/employee/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Employee deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Tìm kiếm nhân viên theo email
export const searchEmployeeByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error searching employee by email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};