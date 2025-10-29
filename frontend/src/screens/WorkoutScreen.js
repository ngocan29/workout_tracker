import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, Platform} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Title, Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MoreVertical, Edit, Trash2 } from 'react-native-feather';
import { useRouter } from 'expo-router';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';
import { WorkoutService, CategoryService } from '../services/api';
import CategoryFormModal from '../components/CategoryFormModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutScreen({ isDarkMode, setDarkMode }) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [branchWorkouts, setBranchWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBranch, setLoadingBranch] = useState(false);

  // Check user type
  const isPersonal = userData?.loai_tai_khoan === 'personal';
  const isBusiness = userData?.loai_tai_khoan === 'business';
  const isEmployee = userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'nhanvien';
  const isCustomer = userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'khachhang';

  // Fetch workouts của user hiện tại
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('Fetching workouts for userID:', user._id);
        const response = await WorkoutService.getWorkouts(user._id);
        console.log('User workouts response:', response);
        if (response.success) {
          const formatted = response.data.map(item => ({
            id: item._id,
            name: item.ten || 'Không có tên',
            duration: item.thoigiangoc ? `${item.thoigiangoc} phút` : 'Chưa rõ',
            category: item.danhmuc?.ten || item.danhmucID?.ten || 'Không có danh mục',
            categoryId: item.danhmucID?._id || item.danhmucID || null,
            calories: item.calo || item.calories || 0,
            completed: item.trangthai === 'hoanthanh',
            image: item.anhminhhoa || 'https://via.placeholder.com/300x200/ccc/000?text=No+Image',
            // Full data for edit mode
            description: item.mota || '',
            steps: item.cacbuoc || [''],
            benefits: item.loiich || [''],
            danhmucID: item.danhmucID?._id || item.danhmucID || '',
            rawDuration: item.thoigiangoc || 30,
            hengiomoinghay: item.hengiomoinghay || ''
          }));
          setWorkouts(formatted);
        } else {
          console.error('Error fetching user workouts:', response.message);
          Alert.alert('Lỗi', response.message || 'Không thể tải danh sách bài tập');
        }
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  // Fetch workouts của chi nhánh (không bao gồm workout của user hiện tại)
  const fetchBranchWorkouts = async () => {
    try {
      setLoadingBranch(true);
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const chinhanhID = user.additional_info?.chinhanhID;
        if (chinhanhID) {
          console.log('Fetching branch workouts for chinhanhID:', chinhanhID);
          const response = await WorkoutService.getWorkoutsByBranch(chinhanhID);
          console.log('Branch workouts response:', response);
          if (response.success) {
            const formatted = response.data.map(item => ({
              id: item._id,
              name: item.ten || 'Không có tên',
              duration: item.thoigiangoc ? `${item.thoigiangoc} phút` : 'Chưa rõ',
              category: item.danhmuc?.ten || item.danhmucID?.ten || 'Không có danh mục',
              categoryId: item.danhmucID?._id || item.danhmucID || null,
              calories: item.calo || item.calories || 0,
              completed: item.trangthai === 'hoanthanh',
              image: item.anhminhhoa || 'https://via.placeholder.com/300x200/ccc/000?text=No+Image',
              // Full data for edit mode
              description: item.mota || '',
              steps: item.cacbuoc || [''],
              benefits: item.loiich || [''],
              danhmucID: item.danhmucID?._id || item.danhmucID || '',
              rawDuration: item.thoigiangoc || 30,
              hengiomoinghay: item.hengiomoinghay || ''
            }));
            setBranchWorkouts(formatted);
          } else {
            console.error('Error fetching branch workouts:', response.message);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching branch workouts:', error);
    } finally {
      setLoadingBranch(false);
    }
  };

//Gọi lại khi trang được focus lại (vd sau khi thêm/sửa)
  //Gọi lại khi trang được focus lại (vd sau khi thêm/sửa)
  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
      // Fetch branch workouts cho employee và customer
      if (isEmployee || isCustomer) {
        fetchBranchWorkouts();
      }
    }, [isEmployee, isCustomer])
  );

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      // Lấy thông tin user
      const currentBranchId = userData?.additional_info?.chinhanhID || userData?.chinhanhID;
      const currentUserId = userData?._id;
      const isPersonal = userData?.loai_tai_khoan === 'personal' && !userData?.additional_info?.vai_tro; // Personal user thuần túy
      const isEmployee = userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'nhanvien';
      const isCustomer = userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'khachhang';
      
      console.log('🔍 fetchCategories - User data:', {
        userType: userData?.loai_tai_khoan,
        isPersonal,
        currentUserId,
        currentBranchId,
        userData: userData
      });
      
      let result;
      
      if (isPersonal || isEmployee || isCustomer) {
        // Personal users, employees và customers lấy categories theo userID nếu có
        // hoặc theo chinhanhID (cho employee/customer)
        if (isPersonal && currentUserId) {
          console.log('👤 Personal user - Fetching categories for user:', currentUserId);
          result = await CategoryService.getCategories(null, currentUserId);
        } else if ((isEmployee || isCustomer) && currentBranchId) {
          console.log('� Employee/Customer - Fetching categories for branch:', currentBranchId);
          result = await CategoryService.getCategories(currentBranchId, null);
        } else {
          console.error('❌ Missing required IDs for personal/employee/customer');
          setCategories([]);
          return;
        }
      } else {
        if (!currentBranchId) {
          console.error('❌ Business user nhưng không có chinhanhID');
          console.error('userData structure:', userData);
          setCategories([]);
          return;
        }
        // Nếu user không phải personal, lấy categories theo chi nhánh
        console.log('🏢 Business user - Fetching categories for branch:', currentBranchId);
        result = await CategoryService.getCategories(currentBranchId, null);
      }
      
      console.log('📋 Categories result:', result);
      setCategories(result || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, [userData]);

  // Load user data khi component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Load categories khi userData thay đổi
  useEffect(() => {
    if (userData) {
      fetchCategories();
    }
  }, [userData, fetchCategories]);

  const toggleDropdown = (workoutId) => {
    setActiveDropdown(activeDropdown === workoutId ? null : workoutId);
  };

  const toggleCategoryDropdown = (categoryId) => {
    setActiveCategoryDropdown(activeCategoryDropdown === categoryId ? null : categoryId);
  };

  const handleEditWorkout = (workout) => {
    setActiveDropdown(null);
    router.push({
      pathname: '/add-workout',
      params: {
        editMode: 'true',
        workoutData: JSON.stringify(workout)
      }
    });
  };

const handleDeleteWorkout = async (workoutId) => {
  try {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Bạn có chắc muốn xóa bài tập này không?");
      if (!confirmDelete) return;

      const res = await WorkoutService.deleteWorkout(workoutId);
      console.log(" Xóa thành công:", res);
      await fetchWorkouts();
      return;
    }

    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa bài tập này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const res = await WorkoutService.deleteWorkout(workoutId);
            console.log("✅ Xóa thành công:", res);
            await fetchWorkouts();
          },
        },
      ]
    );
  } catch (error) {
    console.error("💥 Lỗi khi xóa bài tập:", error);
    if (Platform.OS === "web") {
      window.alert("Lỗi: Không thể xóa bài tập!");
    } else {
      Alert.alert("Lỗi", "Không thể xóa bài tập!");
    }
  }
};

// Category management functions
const handleAddCategory = () => {
  setEditingCategory(null);
  setShowCategoryModal(true);
};

const handleEditCategory = (category) => {
  setEditingCategory(category);
  setShowCategoryModal(true);
  setActiveCategoryDropdown(null);
};

const handleDeleteCategory = async (categoryId) => {
  try {
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?");
      if (!confirmDelete) return;

      try {
        await CategoryService.deleteCategory(categoryId);
        await fetchCategories(); // Reload categories
        window.alert('Xóa danh mục thành công');
      } catch (error) {
        console.error('Error deleting category:', error);
        window.alert(`Lỗi: Không thể xóa danh mục - ${error.message}`);
      }
      return;
    }

    Alert.alert(
      'Xóa Danh Mục',
      'Bạn có chắc chắn muốn xóa danh mục này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await CategoryService.deleteCategory(categoryId);
              await fetchCategories(); // Reload categories
              Alert.alert('Thành công', 'Xóa danh mục thành công');
            } catch (error) {
              console.error('Error deleting category:', error);
              Alert.alert('Lỗi', `Không thể xóa danh mục: ${error.message}`);
            }
          },
        },
      ]
    );
  } catch (error) {
    console.error('Error in handleDeleteCategory:', error);
    if (Platform.OS === "web") {
      window.alert('Có lỗi xảy ra khi xóa danh mục');
    } else {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa danh mục');
    }
  }
  setActiveCategoryDropdown(null);
};

const handleCategorySave = async () => {
  await fetchCategories(); // Reload categories after save
};

  // Handle category click for filtering
  const handleCategoryClick = (categoryId) => {
    if (selectedCategoryId === categoryId) {
      // If same category clicked, show all workouts
      setSelectedCategoryId(null);
    } else {
      // Filter by selected category
      setSelectedCategoryId(categoryId);
    }
  };

  // Check if user can manage categories (business user và personal user thuần túy được thêm/sửa/xóa)
  const canManageCategories = () => {
    return userData && (
      userData.loai_tai_khoan === 'business' || 
      (userData.loai_tai_khoan === 'personal' && !userData.additional_info?.vai_tro)
    );
  };

  // Filter workouts by selected category
  const getFilteredWorkouts = (workoutList) => {
    if (!selectedCategoryId) {
      return workoutList;
    }
    return workoutList.filter(workout => workout.categoryId === selectedCategoryId);
  };

  const filteredWorkouts = getFilteredWorkouts(workouts);
  const filteredBranchWorkouts = getFilteredWorkouts(branchWorkouts);  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}
      activeOpacity={1}
      onPress={() => {
        setActiveDropdown(null);
        setActiveCategoryDropdown(null);
      }}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Tìm kiếm bài tập...</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Danh Mục Tập Luyện
            </Title>
            {canManageCategories() && (
              <Button 
                mode="contained" 
                style={styles.addButton}
                onPress={handleAddCategory}
              >
                Thêm Mới
              </Button>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {/* Show All Categories Button */}
              <View style={styles.categoryContainer}>
                <TouchableOpacity 
                  style={[
                    styles.categoryCard,
                    selectedCategoryId === null && styles.selectedCategoryCard
                  ]}
                  onPress={() => handleCategoryClick(null)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: '#6c757d' + '20' }]}>
                    <Text style={[styles.categoryEmoji]}>📚</Text>
                  </View>
                  <Text style={[styles.categoryName, { color: selectedCategoryId === null ? '#6c757d' : '#999' }]}>
                    Tất cả
                  </Text>
                </TouchableOpacity>
              </View>

              {categories.map((category, index) => (
                <View key={category._id || index} style={styles.categoryContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.categoryCard,
                      selectedCategoryId === category._id && styles.selectedCategoryCard
                    ]}
                    onPress={() => handleCategoryClick(category._id)}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: '#4ECDC4' + '20' }]}>
                      <Text style={[styles.categoryEmoji]}>🏃</Text>
                    </View>
                    <Text style={[styles.categoryName, { 
                      color: selectedCategoryId === category._id ? '#4ECDC4' : '#4ECDC4',
                      fontWeight: selectedCategoryId === category._id ? 'bold' : 'normal'
                    }]}>
                      {category.ten}
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Menu 3 chấm cho category */}
                  {canManageCategories() && (
                    <View style={styles.categoryMenuContainer}>
                      <TouchableOpacity
                        style={styles.categoryMenuButton}
                        onPress={() => toggleCategoryDropdown(category._id)}
                      >
                        <MoreVertical stroke="#666" width={16} height={16} />
                      </TouchableOpacity>
                      
                      {activeCategoryDropdown === category._id && (
                        <View style={styles.categoryDropdown}>
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => handleEditCategory(category)}
                          >
                            <Edit stroke="#666" width={14} height={14} />
                            <Text style={styles.dropdownText}>Sửa</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => handleDeleteCategory(category._id)}
                          >
                            <Trash2 stroke="#e74c3c" width={14} height={14} />
                            <Text style={[styles.dropdownText, { color: '#e74c3c' }]}>Xóa</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* My Workouts | Bài tập của tôi */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              {selectedCategoryId 
                ? `Bài Tập: ${categories.find(cat => cat._id === selectedCategoryId)?.ten || 'Danh mục'} (${filteredWorkouts.length})`
                : `Bài Tập Của Tôi (${filteredWorkouts.length})`
              }
            </Title>
            <Button 
              mode="contained" 
              style={styles.addButton}
              onPress={() => router.push('/add-workout')}
            >
              Thêm Mới
            </Button>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: isDarkMode ? Colors.darkText : Colors.gray }]}>
                Đang tải bài tập...
              </Text>
            </View>
          ) : filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <TouchableOpacity
                style={styles.workoutCardContent}
                onPress={() => router.push({ 
                  pathname: '/workout-detail', 
                  params: { 
                    workoutId: workout.id.toString(),
                    workoutName: workout.name 
                  } 
                })}
              >
                <Image source={{ uri: workout.image }} style={styles.workoutImage} />
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={{ color: Colors.primary, fontSize: 13, marginBottom: 4 }}>
                    {workout.category || 'Không có danh mục'}
                  </Text>
                  <View style={styles.workoutDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="gray" />
                      <Text style={styles.detailText}>{workout.duration}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="flame-outline" size={16} color="gray" />
                      <Text style={styles.detailText}>{workout.calories} calo</Text>
                    </View>
                  </View>
                  <Button
                    mode={workout.completed ? "outlined" : "contained"}
                    style={styles.workoutButton}
                  >
                    {workout.completed ? "Hoàn Thành" : "Bắt Đầu"}
                  </Button>
                </View>
              </TouchableOpacity>
              
              {/* Menu 3 chấm */}
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => toggleDropdown(workout.id)}
                >
                  <MoreVertical stroke="#666" width={20} height={20} />
                </TouchableOpacity>
                
                {activeDropdown === workout.id && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleEditWorkout(workout)}
                    >
                      <Edit stroke="#666" width={16} height={16} />
                      <Text style={styles.dropdownText}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleDeleteWorkout(workout._id || workout.id)}
                    >
                      <Trash2 stroke="#e74c3c" width={16} height={16} />
                      <Text style={[styles.dropdownText, { color: '#e74c3c' }]}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: isDarkMode ? Colors.darkText : Colors.gray }]}>
                Chưa có bài tập nào
              </Text>
            </View>
          )}
        </View>

        {(isEmployee || isCustomer) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
                Bài Tập Chi Nhánh ({filteredBranchWorkouts.length})
              </Title>
            </View>
            {loadingBranch ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: isDarkMode ? Colors.darkText : Colors.gray }]}>
                  Đang tải bài tập chi nhánh...
                </Text>
              </View>
            ) : filteredBranchWorkouts.length > 0 ? (
              filteredBranchWorkouts.map((workout) => (
                <View key={`branch-${workout.id}`} style={styles.workoutCard}>
                  <TouchableOpacity
                    style={styles.workoutCardContent}
                    onPress={() => router.push({ 
                      pathname: '/workout-detail', 
                      params: { 
                        workoutId: workout.id.toString(),
                        workoutName: workout.name 
                      } 
                    })}
                  >
                    <Image source={{ uri: workout.image }} style={styles.workoutImage} />
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={{ color: Colors.primary, fontSize: 13, marginBottom: 4 }}>
                        {workout.category || 'Không có danh mục'}
                      </Text>
                      <View style={styles.workoutDetails}>
                        <View style={styles.detailItem}>
                          <Ionicons name="time-outline" size={16} color="gray" />
                          <Text style={styles.detailText}>{workout.duration}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Ionicons name="flame-outline" size={16} color="gray" />
                          <Text style={styles.detailText}>{workout.calories} calo</Text>
                        </View>
                      </View>
                      <Button
                        mode={workout.completed ? "outlined" : "contained"}
                        style={styles.workoutButton}
                      >
                        {workout.completed ? "Hoàn Thành" : "Bắt Đầu"}
                      </Button>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: isDarkMode ? Colors.darkText : Colors.gray }]}>
                  Chưa có bài tập nào từ chi nhánh
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Category Form Modal - Business user và Personal user thuần túy có modal này */}
      {(userData?.loai_tai_khoan === 'business' || 
        (userData?.loai_tai_khoan === 'personal' && !userData?.additional_info?.vai_tro)) && (
        <CategoryFormModal
          visible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleCategorySave}
          editCategory={editingCategory}
          isDarkMode={isDarkMode}
          chinhanhID={userData?.additional_info?.chinhanhID || userData?.chinhanhID}
          userID={userData?.loai_tai_khoan === 'personal' ? userData?._id : null}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  searchContainer: { margin: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchPlaceholder: { flex: 1, color: 'gray' },
  section: { marginHorizontal: 16, marginVertical: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18 },
  categoryRow: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  categoryContainer: { position: 'relative' },
  categoryCard: { alignItems: 'center', padding: 8, borderRadius: 8 },
  selectedCategoryCard: {
    backgroundColor: 'rgba(76, 205, 196, 0.1)',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  categoryIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  categoryEmoji: { fontSize: 20 },
  categoryName: { fontWeight: 'bold', marginTop: 4 },
  categoryMenuContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 1,
  },
  categoryMenuButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  categoryDropdown: {
    position: 'absolute',
    top: 25,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 100,
    zIndex: 1000,
  },
  workoutCard: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12, 
    elevation: 2,
    position: 'relative',
  },
  workoutCardContent: { 
    flex: 1, 
    flexDirection: 'row' 
  },
  menuContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 120,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  workoutImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  workoutInfo: { flex: 1 },
  workoutName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  workoutDetails: { flexDirection: 'row', marginBottom: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  detailText: { marginLeft: 4, color: 'gray' },
  workoutButton: { marginTop: 4 },
  addButton: { borderRadius: 8 },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});