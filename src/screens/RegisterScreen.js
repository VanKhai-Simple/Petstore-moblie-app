import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, ActivityIndicator, Dimensions, Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { userApi } from '../api/userApi';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({ 
    username: '', password: '', confirmPassword: '', 
    fullName: '', email: '', phone: '' 
  });
  const [loading, setLoading] = useState(false);
  
  // State hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State và Ref cho Toast trượt
  const [toast, setToast] = useState({ msg: '', type: '' });
  const slideAnim = useRef(new Animated.Value(-100)).current; 

  const showMsg = (msg, type = 'error') => {
    setToast({ msg, type });
    Animated.spring(slideAnim, { toValue: 50, useNativeDriver: true, bounciness: 10 }).start();
    setTimeout(() => {
      Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }).start(() => setToast({ msg: '', type: '' }));
    }, 2500);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(0[3|5|7|8|9])([0-9]{8})$/.test(phone);

  const handleRegister = async () => {
    const { username, password, confirmPassword, fullName, email, phone } = formData;

    if (Object.values(formData).some(v => !v)) return showMsg("Vui lòng nhập đủ thông tin!");
    if (fullName.trim().length < 5) return showMsg("Họ tên phải ít nhất 5 ký tự!");
    if (!validateEmail(email)) return showMsg("Email không đúng định dạng!");
    if (!validatePhone(phone)) return showMsg("Số điện thoại không hợp lệ!");
    if (username.length < 5 || /\s/.test(username)) return showMsg("Username ít nhất 5 ký tự và không có khoảng trắng!");
    if (password.length < 6) return showMsg("Mật khẩu phải từ 6 ký tự trở lên!");
    if (password !== confirmPassword) return showMsg("Mật khẩu xác nhận không khớp!");

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData; 
      const response = await userApi.register(dataToSend);
      
      // --- PHẦN XỬ LÝ LỖI SERVER LINH HOẠT ---
      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json(); 
      } else {
        result = await response.text(); 
      }

      if (response.ok) {
        showMsg("Đăng ký thành công!", "success");
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('Login');
        }, 1500);
      } else {
        setLoading(false);
        let serverMsg = "Lỗi đăng ký";
        if (typeof result === 'object') {
          if (result.errors) serverMsg = Object.values(result.errors).flat()[0];
          else if (result.message) serverMsg = result.message;
        } else {
          serverMsg = result; // Trả về text thuần như "Email tồn tại"
        }
        showMsg(serverMsg);
      }
    } catch (error) {
      setLoading(false);
      showMsg("Lỗi kết nối tới Server!");
    }
  };

  // Helper render Input có nút ẩn/hiện pass
  const renderInput = (key, placeholder, icon, isPassword = false, isShow, setIsShow) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#A65215" style={styles.inputIcon} />
      <TextInput 
        style={styles.input} 
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={isPassword && !isShow}
        value={formData[key]}
        onChangeText={(t) => setFormData({...formData, [key]: t})}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setIsShow(!isShow)}>
          <Ionicons name={isShow ? "eye-outline" : "eye-off-outline"} size={20} color="#CCC" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {toast.msg ? (
        <Animated.View style={[styles.toastContainer, { transform: [{ translateY: slideAnim }], backgroundColor: toast.type === 'success' ? '#4CAF50' : '#FF4D4D' }]}>
          <Ionicons name={toast.type === 'success' ? "checkmark-circle" : "alert-circle"} size={20} color="white" />
          <Text style={styles.toastText}>{toast.msg}</Text>
        </Animated.View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerDecoration} />
        <View style={styles.content}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subTitle}>Gia nhập gia đình Pet Shop ngay!</Text>

          <View style={styles.form}>
            {renderInput('fullName', 'Họ tên', 'person-outline')}
            {renderInput('email', 'Email', 'mail-outline')}
            {renderInput('phone', 'Số điện thoại', 'call-outline')}
            {renderInput('username', 'Tên đăng nhập', 'at-circle-outline')}
            
            {/* Ô mật khẩu */}
            {renderInput('password', 'Mật khẩu', 'lock-closed-outline', true, showPassword, setShowPassword)}
            
            {/* Ô xác nhận mật khẩu */}
            {renderInput('confirmPassword', 'Xác nhận mật khẩu', 'shield-checkmark-outline', true, showConfirmPassword, setShowConfirmPassword)}

            <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.btnWrapper}>
              <LinearGradient colors={['#A65215', '#F2A365']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.btn}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Đăng ký ngay</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>Đã có tài khoản? <Text style={styles.link}>Đăng nhập</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F0' },
  toastContainer: { position: 'absolute', top: 0, left: 20, right: 20, zIndex: 999, padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', elevation: 10 },
  toastText: { color: 'white', marginLeft: 10, fontWeight: '600' },
  headerDecoration: { height: 120, backgroundColor: '#FDE1D3', borderBottomLeftRadius: 60, borderBottomRightRadius: 60, position: 'absolute', top: 0, width: width },
  content: { padding: 25, marginTop: 70 },
  title: { marginTop: 30, fontSize: 32, fontWeight: 'bold', color: '#402008' },
  subTitle: { fontSize: 16, color: '#A65215', marginBottom: 25 },
  form: { backgroundColor: 'white', padding: 20, borderRadius: 30, elevation: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', marginBottom: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#402008' },
  btnWrapper: { marginTop: 15 },
  btn: { padding: 16, borderRadius: 20, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
  footer: { marginTop: 25, marginBottom: 40, alignItems: 'center' },
  footerText: { color: '#888' },
  link: { color: '#A65215', fontWeight: 'bold' }
});