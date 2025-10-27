# Frontend Structure

## 📁 Cấu trúc thư mục

```
frontend/
├── app/                   # Expo Router (file-based routing)
│   ├── _layout.tsx       # Root layout
│   ├── index.js          # Login screen (/)
│   ├── account-type.js   # Account type selection
│   ├── register.js       # Registration screen
│   ├── branch-home.js    # Branch home screen
│   └── edit-profile.js   # Edit profile screen
├── src/                   # Thư mục nguồn chính
│   ├── screens/          # Các màn hình UI
│   ├── components/       # Components tái sử dụng
│   │   └── ui/          # UI components cụ thể
│   ├── constants/        # Hằng số, cấu hình
│   ├── services/         # API services  
│   └── navigation/       # Navigation utilities
├── assets/               # Tài nguyên (hình ảnh, fonts...)
├── App.js.backup        # Backup của App.js cũ
├── package.json         # Dependencies
└── app.json            # Expo configuration

```

## 🚀 Expo Router

Ứng dụng sử dụng **Expo Router** với file-based routing:

### Routes:
- `/` → LoginScreen (index.js)
- `/account-type` → AccountTypeSelection
- `/register` → RegisterScreen  
- `/branch-home` → BranchHome
- `/edit-profile` → EditProfileScreen

### Navigation:
```javascript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate
router.push('/account-type');
router.replace('/branch-home');
router.back();

// With params
router.push({ 
  pathname: '/register', 
  params: { accountType: 'business' } 
});
```

## 📋 Chi tiết từng thư mục

### `src/screens/`
Chứa các màn hình chính của ứng dụng:
- **LoginScreen.js** - Màn hình đăng nhập
- **RegisterScreen.js** - Màn hình đăng ký 
- **BranchHome.tsx** - Màn hình chính chi nhánh
- **HomeScreen.js** - Màn hình trang chủ
- **WorkoutScreen.js** - Màn hình tập luyện
- **NutritionScreen.js** - Màn hình dinh dưỡng
- **ProfileScreen.js** - Màn hình hồ sơ cá nhân
- **ProgressScreen.js** - Màn hình theo dõi tiến độ

### `src/components/`
Components có thể tái sử dụng:
- **ui/** - UI components chuyên dụng
  - `Navbar.js` - Thanh điều hướng
  - `BottomTabBar.js` - Thanh tab dưới
  - `WorkoutModal.js` - Modal tập luyện
  - `NutritionModal.js` - Modal dinh dưỡng

### `src/constants/`
Hằng số và cấu hình:
- **Colors.js** - Bảng màu ứng dụng
- **Data.js** - Dữ liệu tĩnh
- **api.js** - Cấu hình API

### `src/services/`
Dịch vụ API:
- **api.js** - Các service gọi API (AuthService, BranchService...)

### `src/navigation/`
Cấu hình điều hướng:
- **AppNavigation.js** - Cấu hình navigation chính

## 🔧 Import Paths

Tất cả imports đều sử dụng đường dẫn tương đối từ `src/`:

```javascript
// Trong screens/
import { Colors } from '../constants/Colors';
import Navbar from '../components/ui/Navbar';
import { AuthService } from '../services/api';

// Trong components/ui/
import { Colors } from '../../constants/Colors';

// Trong App.js
import LoginScreen from './src/screens/LoginScreen';
```

## ✅ Lợi ích của cấu trúc mới

1. **Rõ ràng**: Mọi thứ được tổ chức trong `src/`
2. **Không trùng lặp**: Loại bỏ các file/folder duplicate
3. **Dễ bảo trì**: Import paths nhất quán và logic
4. **Scalable**: Dễ dàng thêm features mới
5. **Chuẩn React Native**: Tuân theo best practices

## 🚀 Next Steps

- Xem xét thêm folder `src/hooks/` cho custom hooks
- Cân nhắc `src/utils/` cho utility functions
- Có thể thêm `src/types/` cho TypeScript definitions