import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/api';

const API_URL = `${API_CONFIG.BASE_URL}/dinhduong`;

export const createDinhDuong = async (data) => {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Lưu thất bại');
  return res.json();
};

export const getDinhDuongByKhachHang = async (khachhangUserID) => {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}?khachhangUserID=${khachhangUserID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Tải thất bại');
  return res.json();
};

// Lấy dữ liệu dinh dưỡng theo userID
export const getDinhDuongByUser = async (userID) => {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/user/${userID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 404) {
      return null; // Chưa có dữ liệu dinh dưỡng
    }
    throw new Error('Tải dữ liệu dinh dưỡng thất bại');
  }
  return res.json();
};