# Workout Navigation Feature

## 📋 Chức năng điều hướng từ WorkoutScreen sang WorkoutDetailScreen

### 🎯 **Mô tả:**
Khi người dùng nhấn vào bất kỳ thẻ bài tập nào trong WorkoutScreen, họ sẽ được chuyển đến WorkoutDetailScreen với thông tin chi tiết của bài tập đó.

### 🛣️ **Luồng điều hướng:**
1. **WorkoutScreen** → hiển thị danh sách các bài tập
2. **Click vào thẻ bài tập** → chuyển sang WorkoutDetailScreen với params
3. **WorkoutDetailScreen** → hiển thị chi tiết bài tập và timer
4. **Click "Hoàn Thành" hoặc "←"** → quay lại WorkoutScreen

### 🔧 **Technical Implementation:**

#### **Expo Router Setup:**
```typescript
// app/_layout.tsx
<Stack.Screen name="workout-detail" options={{ title: 'Chi tiết bài tập' }} />
```

#### **WorkoutScreen Navigation:**
```javascript
// src/screens/WorkoutScreen.js
import { useRouter } from 'expo-router';

const router = useRouter();

// Click handler
onPress={() => router.push({ 
  pathname: '/workout-detail', 
  params: { 
    workoutId: workout.id.toString(),
    workoutName: workout.name 
  } 
})}
```

#### **WorkoutDetailScreen Receiving Params:**
```javascript
// src/screens/WorkoutDetailScreen.js
import { useRouter, useLocalSearchParams } from 'expo-router';

const router = useRouter();
const { workoutId } = useLocalSearchParams();

// Dynamic workout data based on workoutId
const workout = workoutDetails[workoutId] || workoutDetails[1];

// Back navigation
onPress={() => router.back()}
```

### 📱 **Available Workouts:**
1. **Cardio Buổi Sáng** (ID: 1)
   - Duration: 30 phút
   - Calories: 250
   - Focus: Tim mạch, đốt cháy mỡ

2. **Tập Tạ Cơ Bản** (ID: 2)
   - Duration: 45 phút  
   - Calories: 300
   - Focus: Xây dựng cơ bắp

3. **Yoga Thư Giãn** (ID: 3)
   - Duration: 60 phút
   - Calories: 150
   - Focus: Thư giãn, linh hoạt

4. **HIIT Cường Độ Cao** (ID: 4)
   - Duration: 20 phút
   - Calories: 200
   - Focus: Đốt cháy nhanh

### ⚡ **Features trong WorkoutDetailScreen:**
- ⏱️ **Timer**: Đếm ngược thời gian tập luyện
- 📋 **Steps**: Hướng dẫn từng bước thực hiện
- 💪 **Benefits**: Lợi ích của bài tập
- 🔄 **Dynamic Content**: Nội dung thay đổi theo workoutId
- ↩️ **Back Navigation**: router.back() để quay lại

### 🎨 **UI Components:**
- Header với nút back và tên bài tập
- Image placeholder với màu theo loại bài tập
- Timer với các nút Start/Pause/Reset
- FlatList hiển thị steps và benefits
- Complete button để hoàn thành bài tập