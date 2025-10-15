import { API_CONFIG } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utility function để tạo request headers
const createHeaders = async (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    // Lấy userId từ storage (tạm thời, sau này sẽ dùng JWT token)
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      headers['user-id'] = userId;
    }
  }
  
  return headers;
};

// Generic API call function
const apiCall = async (endpoint, method = 'GET', data = null, includeAuth = true) => {
  try {
    const headers = await createHeaders(includeAuth);
    
    const config = {
      method,
      headers,
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }
    
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log('Making API call:', { url, method, headers, data });
    
    const response = await fetch(url, config);
    console.log('API Response status:', response.status, response.statusText);
    
    const responseData = await response.json();
    console.log('API Response data:', responseData);
    
    if (!response.ok) {
      throw new Error(responseData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      endpoint,
      method,
      data
    });
    throw error;
  }
};

// Authentication Services
export const AuthService = {
  // Đăng nhập
  login: async (email, password) => {
    const data = await apiCall(API_CONFIG.ENDPOINTS.LOGIN, 'POST', { email, matkhau: password }, false);
    
    // Lưu userId vào storage
    if (data.user && data.user._id) {
      await AsyncStorage.setItem('userId', data.user._id);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Đăng ký
  register: async (userData) => {
    const data = await apiCall(API_CONFIG.ENDPOINTS.REGISTER, 'POST', userData, false);
    
    // Lưu userId vào storage
    if (data.user && data.user._id) {
      await AsyncStorage.setItem('userId', data.user._id);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Đăng xuất
  logout: async () => {
    await apiCall(API_CONFIG.ENDPOINTS.LOGOUT, 'POST');
    
    // Xóa dữ liệu từ storage
    await AsyncStorage.multiRemove(['userId', 'userData']);
    
    return { success: true };
  },

  // Lấy thông tin profile
  getProfile: async () => {
    return await apiCall(API_CONFIG.ENDPOINTS.PROFILE, 'GET');
  },

  // Cập nhật profile
  updateProfile: async (userData) => {
    return await apiCall(API_CONFIG.ENDPOINTS.PROFILE, 'PUT', userData);
  },

  // Kiểm tra user hiện tại từ storage
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
};

// Branch Services
export const BranchService = {
  // Lấy danh sách chi nhánh của user hiện tại
  getMyBranches: async () => {
    return await apiCall(API_CONFIG.ENDPOINTS.MY_BRANCHES, 'GET');
  },

  // Thêm chi nhánh mới
  createBranch: async (branchData) => {
    return await apiCall(API_CONFIG.ENDPOINTS.BRANCHES, 'POST', branchData);
  },

  // Cập nhật chi nhánh
  updateBranch: async (branchId, branchData) => {
    return await apiCall(`${API_CONFIG.ENDPOINTS.BRANCHES}/${branchId}`, 'PUT', branchData);
  },

  // Xóa chi nhánh
  deleteBranch: async (branchId) => {
    return await apiCall(`${API_CONFIG.ENDPOINTS.BRANCHES}/${branchId}`, 'DELETE');
  },

  // Lấy chi nhánh theo company ID
  getBranchesByCompany: async (companyId) => {
    return await apiCall(`${API_CONFIG.ENDPOINTS.COMPANY_BRANCHES}/${companyId}`, 'GET');
  },
};