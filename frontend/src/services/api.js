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
    console.log('🚀 Making API call:', { url, method, headers, data });
    
    const response = await fetch(url, config);
    console.log('📡 API Response status:', response.status, response.statusText);
    
    // Check if response is ok before parsing JSON
    if (!response.ok) {
      console.error('❌ API Response not ok:', response.status, response.statusText);
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const responseData = await response.json();
    console.log('✅ API Response data:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('💥 API Error:', error);
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

// Workout Services
export const WorkoutService = {
  // Lấy danh sách bài tập với userID filter
  getWorkouts: async (userID = null) => {
    const url = userID 
      ? `${API_CONFIG.ENDPOINTS.WORKOUTS}?userID=${userID}`
      : API_CONFIG.ENDPOINTS.WORKOUTS;
    return await apiCall(url, 'GET');
  },

  // Lấy bài tập theo chi nhánh
  getWorkoutsByBranch: async (chinhanhID, danhmucID = null) => {
    const url = danhmucID 
      ? `${API_CONFIG.ENDPOINTS.WORKOUTS}/chinhanh/${chinhanhID}?danhmucID=${danhmucID}`
      : `${API_CONFIG.ENDPOINTS.WORKOUTS}/chinhanh/${chinhanhID}`;
    return await apiCall(url, 'GET');
  },

  // Tạo bài tập mới
  createWorkout: async (workoutData) => {
    return await apiCall(API_CONFIG.ENDPOINTS.WORKOUT_CREATE, 'POST', workoutData);
  },

  // Cập nhật bài tập
  updateWorkout: async (workoutId, workoutData) => {
    return await apiCall(`${API_CONFIG.ENDPOINTS.WORKOUT_UPDATE}/${workoutId}`, 'PUT', workoutData);
  },

  // Xóa bài tập
  deleteWorkout: async (workoutId) => {
    return await apiCall(`${API_CONFIG.ENDPOINTS.WORKOUT_DELETE}/${workoutId}`, 'DELETE');
  },

  // Lấy chi tiết bài tập
  getWorkoutDetail: async (workoutId) => {
    return await apiCall(`${API_CONFIG.ENDPOINTS.WORKOUTS}/${workoutId}`, 'GET');
  },
};

// Category Services
export const CategoryService = {
  // Lấy danh sách danh mục (ưu tiên chi nhánh, fallback về userID)
  getCategories: async (chinhanhID = null, userID = null) => {
    if (chinhanhID) {
      // Nếu có chi nhánh, lấy theo chi nhánh
      console.log('🏢 Fetching categories by branch:', chinhanhID);
      return await apiCall(`/danhmuc/chinhanh/${chinhanhID}`, 'GET');
    } else if (userID) {
      // Nếu không có chi nhánh nhưng có userID, lấy theo user
      console.log('👤 Fetching categories by user:', userID);
      return await apiCall(`/danhmuc/user/${userID}`, 'GET');
    }
    // Nếu không có gì, trả về mảng rỗng thay vì gọi tất cả
    console.warn('⚠️ No chinhanhID or userID provided for getCategories');
    return [];
  },

  // Lấy danh mục theo userID
  getCategoriesByUser: async (userID) => {
    return await apiCall(`/danhmuc/user/${userID}`, 'GET');
  },

  // Tạo danh mục mới (tự động gán chinhanhID và userID nếu có)
  createCategory: async (categoryData, chinhanhID = null, userID = null) => {
    const dataWithInfo = { ...categoryData };
    
    // Gán chinhanhID nếu có (cho business user)
    if (chinhanhID) {
      dataWithInfo.chinhanhID = chinhanhID;
    }
    
    // Gán userID nếu có (cho personal user) 
    // userID sẽ được gửi qua header tự động từ apiCall utility
    
    return await apiCall('/danhmuc', 'POST', dataWithInfo);
  },

  // Cập nhật danh mục
  updateCategory: async (categoryId, categoryData) => {
    return await apiCall(`/danhmuc/${categoryId}`, 'PUT', categoryData);
  },

  // Xóa danh mục
  deleteCategory: async (categoryId) => {
    return await apiCall(`/danhmuc/${categoryId}`, 'DELETE');
  },

  // Lấy chi tiết danh mục
  getCategoryDetail: async (categoryId) => {
    return await apiCall(`/danhmuc/${categoryId}`, 'GET');
  },
};

// Nutrition Service - API cho dinh dưỡng
export const NutritionService = {
  // Lấy tất cả thông tin dinh dưỡng
  getAllNutritionData: async () => {
    console.log('🍎 Fetching all nutrition data');
    return await apiCall('/dinhduong', 'GET');
  },

  // Lấy thông tin dinh dưỡng của user cụ thể (mới nhất)
  getNutritionData: async (userID) => {
    console.log('🍎 Fetching nutrition data for user:', userID);
    return await apiCall(`/dinhduong/user/${userID}`, 'GET');
  },

  // Tạo thông tin dinh dưỡng mới (lần đầu tiên)
  createNutritionData: async (nutritionData) => {
    console.log('🌱 Creating nutrition data:', nutritionData);
    return await apiCall('/dinhduong', 'POST', nutritionData);
  },

  // Cập nhật thông tin dinh dưỡng (hàng tháng)
  updateNutritionData: async (nutritionId, nutritionData) => {
    console.log('🔄 Updating nutrition data:', nutritionId, nutritionData);
    return await apiCall(`/dinhduong/${nutritionId}`, 'PUT', nutritionData);
  },
};