// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.2:5000', // Backend chạy trên port 5000
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
    DEFAULT_BRANCH: '/chinhanh/company/{congtyID}/default',
    
    // User endpoints
    USERS: '/users',
    USERS_SEARCH: '/users/search',
    
    // Customer endpoints
    CUSTOMERS: '/khachhang',
    CUSTOMERS_BY_BRANCH: '/khachhang/chinhanh',
    
    // Employee endpoints
    EMPLOYEES: '/nhanvien',
    EMPLOYEES_BY_BRANCH: '/nhanvien/chinhanh',
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