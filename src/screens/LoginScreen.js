import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import { useAppContext } from '../context/AppContext';
import { userApi } from '../api/userApi';
import TopToast from '../components/TopToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const { setIsLogin, setToken, setUser } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showMsg = (msg, type = 'error') => setToast({ msg, type });

  const handleLogin = async () => {
    const u = username.trim();
    const p = password.trim();

    if (!u || !p) return showMsg("Vui lòng điền đủ thông tin!");

    setLoading(true);
    try {
      const response = await userApi.login({ username: u, password: p });
      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        result = { message: await response.text() };
      }

      if (response.ok) {
        showMsg("Đăng nhập thành công!", "success");

        await AsyncStorage.setItem('userToken', result.token);
        await AsyncStorage.setItem('userData', JSON.stringify({ 
          username: result.username, 
          role: result.role 
        }));

        setToken(result.token);
        setUser({ username: result.username, role: result.role }); 

        setTimeout(() => {
          setLoading(false);
          setIsLogin(true);
        }, 1000);
      } else {
        setLoading(false);
        // Lấy lỗi linh hoạt từ Server
        let errorMsg = "Sai tài khoản hoặc mật khẩu";
        if (result.errors) {
          errorMsg = Object.values(result.errors).flat()[0];
        } else if (result.message) {
          errorMsg = result.message;
        }
        showMsg(errorMsg);
      }
    } catch (error) {
      setLoading(false);
      console.log("Login Error:", error);
      showMsg("Lỗi kết nối API!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Component này sẽ xử lý việc trượt từ trên xuống */}
      <TopToast message={toast.msg} type={toast.type} onHide={() => setToast({ msg: '', type: '' })} />
      
      <View style={styles.card}>
        <Text style={styles.headerText}>Chào mừng trở lại</Text>
        <Text style={styles.subText}>Vui lòng nhập thông tin của bạn để đăng nhập.</Text>

        <Text style={styles.label}>Tên đăng nhập / Email</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Nhập tài khoản của bạn" 
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none" 
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TouchableOpacity><Text style={styles.forgotText}>Quên mật khẩu?</Text></TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Nhập mật khẩu của bạn" 
            secureTextEntry={!showPassword} 
            value={password} 
            onChangeText={setPassword} 
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#A65215" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={handleLogin} disabled={loading} style={{marginTop: 25}}>
          <LinearGradient colors={['#A65215', '#F2A365']} style={styles.btn}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Đăng nhập</Text>}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
           <View style={styles.line} />
           <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
           <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
             <FontAwesome name="google" size={20} color="black" />
             <Text style={styles.socialBtnText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
             <FontAwesome name="facebook-square" size={20} color="#1877F2" />
             <Text style={styles.socialBtnText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Register')}>
          <Text style={{color: '#666'}}>Chưa có tài khoản? <Text style={styles.link}>Đăng ký</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... Styles giữ nguyên như của ông
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F0', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#402008', textAlign: 'center' },
  subText: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 25, marginTop: 5 },
  label: { fontSize: 14, fontWeight: '600', color: '#402008', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F0', paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#F2D8C9' },
  input: { height: 50, color: '#402008' },
  forgotText: { fontSize: 12, color: '#A65215', fontWeight: '600' },
  btn: { padding: 16, borderRadius: 25, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#EEE' },
  dividerText: { marginHorizontal: 10, color: '#888', fontSize: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F0', width: '48%', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#F2D8C9' },
  socialBtnText: { marginLeft: 10, fontWeight: '600', fontSize: 14 },
  footer: { marginTop: 30, alignItems: 'center' },
  link: { color: '#A65215', fontWeight: 'bold' }
});