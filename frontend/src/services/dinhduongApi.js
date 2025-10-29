import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-api.com/api/dinhduong';

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