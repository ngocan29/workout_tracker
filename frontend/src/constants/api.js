// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000', // Backend chạy trên port 5000
  ENDPOINTS: {
    // Auth endpoints (không có prefix /api)
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    
    // Chi nhánh endpoints  
    BRANCHES: '/chinhanh',
    MY_BRANCHES: '/chinhanh/my-branches',
    COMPANY_BRANCHES: '/chinhanh/company',
    
    // Workout endpoints
    WORKOUTS: '/baitap',
    WORKOUT_CREATE: '/baitap',
    WORKOUT_UPDATE: '/baitap',
    WORKOUT_DELETE: '/baitap',
    WORKOUT_DETAIL: '/baitap',
    
    // User endpoints
    USERS: '/users',
  }
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST', 
  PUT: 'PUT',
  DELETE: 'DELETE'
};

// Response Status
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Export BASE_URL cho backward compatibility
export const API_BASE_URL = 'http://localhost:5000';