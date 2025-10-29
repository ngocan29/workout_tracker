import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { CategoryService } from '../services/api';

const CategoryFormModal = ({ 
  visible, 
  onClose, 
  onSave, 
  editCategory = null,
  isDarkMode = false,
  chinhanhID = null,  // Prop chinhanhID cho business user
  userID = null       // Prop userID cho personal user
}) => {
  const [ten, setTen] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editCategory) {
      setTen(editCategory.ten || '');
    } else {
      setTen('');
    }
  }, [editCategory, visible]);

  const handleSave = async () => {
    if (!ten.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setLoading(true);
      let result;

      if (editCategory) {
        // Cập nhật danh mục
        result = await CategoryService.updateCategory(editCategory._id, { ten: ten.trim() });
      } else {
        // Tạo danh mục mới - truyền chinhanhID hoặc userID tùy loại user
        result = await CategoryService.createCategory({ ten: ten.trim() }, chinhanhID, userID);
      }

      Alert.alert(
        'Thành công', 
        editCategory ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công',
        [
          {
            text: 'OK',
            onPress: () => {
              setTen('');
              onSave(result);
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTen('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          { backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white }
        ]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[
              styles.modalTitle,
              { color: isDarkMode ? Colors.darkText : Colors.black }
            ]}>
              {editCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons 
                name="close" 
                size={24} 
                color={isDarkMode ? Colors.darkText : Colors.black} 
              />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={[
              styles.inputLabel,
              { color: isDarkMode ? Colors.darkText : Colors.black }
            ]}>
              Tên danh mục *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.lightGray,
                  borderColor: isDarkMode ? Colors.darkSecondary : Colors.gray,
                  color: isDarkMode ? Colors.darkText : Colors.black,
                }
              ]}
              value={ten}
              onChangeText={setTen}
              placeholder="Nhập tên danh mục..."
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              maxLength={50}
              autoFocus={true}
            />

            {/* Character counter */}
            <Text style={[
              styles.characterCounter,
              { color: isDarkMode ? Colors.darkSecondary : Colors.gray }
            ]}>
              {ten.length}/50
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                { backgroundColor: loading ? Colors.gray : Colors.primary }
              ]}
              onPress={handleSave}
              disabled={loading || !ten.trim()}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editCategory ? 'Cập nhật' : 'Tạo mới'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  characterCounter: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  cancelButtonText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategoryFormModal;
