import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { Card, TextInput, Button, Title } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';

export default function ContactScreen({ isDarkMode, setDarkMode, setCurrentScreen, userData, branchData }) {
  const [form, setForm] = useState({
    hoTen: userData?.ten || userData?.ho_ten || userData?.name || '',
    email: userData?.email || '',
    soDienThoai: userData?.sdt || userData?.so_dien_thoai || '',
    vanDe: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xác định email đích dựa trên loại tài khoản
  const getTargetEmail = () => {
    const isBusiness = userData?.loai_tai_khoan === 'business';
    const isPersonal = userData?.loai_tai_khoan === 'personal' && (!userData?.additional_info?.vai_tro || userData?.additional_info?.vai_tro === 'canhan');
    
    // Business và Personal gửi đến email mặc định
    if (isBusiness || isPersonal) {
      return 'thientuyet1192005@gmail.com';
    }
    
    // Khách hàng và nhân viên gửi đến email công ty
    return branchData?.email || userData?.company_email || 'thientuyet1192005@gmail.com';
  };

  const validateForm = () => {
    if (!form.hoTen.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return false;
    }
    if (!form.email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }
    if (!form.soDienThoai.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (!form.vanDe.trim()) {
      Alert.alert('Lỗi', 'Vui lòng mô tả vấn đề cần hỗ trợ');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const targetEmail = getTargetEmail();
      const emailBody = `
Thông tin liên hệ từ ứng dụng FitTracker:

Họ tên: ${form.hoTen}
Email: ${form.email}
Số điện thoại: ${form.soDienThoai}

Vấn đề cần hỗ trợ:
${form.vanDe}

---
Gửi từ ứng dụng FitTracker Pro
      `.trim();

      // Trên web, mở email client
      if (Platform.OS === 'web') {
        const mailtoLink = `mailto:${targetEmail}?subject=Yêu cầu hỗ trợ từ ${form.hoTen}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoLink, '_blank');
      } else {
        // Trên mobile, có thể tích hợp với API gửi email hoặc mở email app
        const mailtoLink = `mailto:${targetEmail}?subject=Yêu cầu hỗ trợ từ ${form.hoTen}&body=${encodeURIComponent(emailBody)}`;
        await Linking.openURL(mailtoLink);
      }

      Alert.alert(
        'Thành công', 
        'Yêu cầu hỗ trợ đã được gửi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setForm(prev => ({ ...prev, vanDe: '' }));
              setCurrentScreen('profile');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error sending contact request:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompanyInfo = () => {
    const isBusiness = userData?.loai_tai_khoan === 'business';
    const isPersonal = userData?.loai_tai_khoan === 'personal' && (!userData?.additional_info?.vai_tro || userData?.additional_info?.vai_tro === 'canhan');
    
    if (isBusiness || isPersonal) {
      return {
        name: 'FitTracker Support',
        email: 'thientuyet1192005@gmail.com'
      };
    }
    
    return {
      name: branchData?.ten_chi_nhanh || userData?.company_name || 'Công ty',
      email: branchData?.email || userData?.company_email || 'thientuyet1192005@gmail.com'
    };
  };

  const companyInfo = getCompanyInfo();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setDarkMode}
        showBackButton={true}
        onBackPress={() => setCurrentScreen('profile')}
        title="Liên hệ hỗ trợ"
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Header Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={24} color={Colors.darkGreen} />
              </View>
              <View style={styles.headerText}>
                <Title style={styles.headerTitle}>Liên hệ hỗ trợ</Title>
                <Text style={styles.headerSubtitle}>
                  Gửi yêu cầu hỗ trợ đến {companyInfo.name} hoặc
                </Text>
                <Text style={styles.emailInfo}>
                  📧 {companyInfo.email}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Contact Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Thông tin liên hệ</Title>
            
            <TextInput
              label="Họ và tên *"
              value={form.hoTen}
              onChangeText={(text) => setForm(prev => ({ ...prev, hoTen: text }))}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Email *"
              value={form.email}
              onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Số điện thoại *"
              value={form.soDienThoai}
              onChangeText={(text) => setForm(prev => ({ ...prev, soDienThoai: text }))}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              label="Mô tả vấn đề cần hỗ trợ *"
              value={form.vanDe}
              onChangeText={(text) => setForm(prev => ({ ...prev, vanDe: text }))}
              style={styles.textArea}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải hoặc cần hỗ trợ..."
              left={<TextInput.Icon icon="comment-text" />}
            />

            <View style={styles.noteContainer}>
              <Ionicons name="information-circle" size={16} color={Colors.darkGreen} />
              <Text style={styles.noteText}>
                Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 24 giờ.
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Contact Info */}
        <Card style={styles.quickContactCard}>
          <Card.Content>
            <Title style={styles.quickContactTitle}>Thông tin liên hệ nhanh</Title>
            
            <View style={styles.contactItem}>
              <Ionicons name="call" size={20} color={Colors.darkGreen} />
              <Text style={styles.contactText}>Hotline: 0353 763 573</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="time" size={20} color={Colors.darkGreen} />
              <Text style={styles.contactText}>Thời gian hỗ trợ: 8:00 - 22:00 hàng ngày</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="location" size={20} color={Colors.darkGreen} />
              <Text style={styles.contactText}>Địa chỉ: 219 Trung Kính, Hà Nội</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    margin: 16,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.darkGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  emailInfo: {
    fontSize: 13,
    color: Colors.darkGreen,
    fontWeight: '500',
  },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 16,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGreen + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noteText: {
    fontSize: 13,
    color: Colors.darkGreen,
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    borderRadius: 8,
    backgroundColor: Colors.darkGreen,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  quickContactCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  quickContactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});