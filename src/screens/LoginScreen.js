import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import { useAppContext } from '../context/AppContext';
import { userApi } from '../api/userApi';
import TopToast from '../components/TopToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IMPORT MỚI ---
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { GOOGLE_ANDROID_CLIENT_ID_RELEASE ,GOOGLE_WEB_CLIENT_ID, FACEBOOK_APP_ID } from '@env';

WebBrowser.maybeCompleteAuthSession(); // Cần thiết để đóng cửa sổ trình duyệt sau khi login

export default function LoginScreen({ navigation }) {
  const { setIsLogin, setToken, setUser } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [toast, setToast] = useState({ msg: '', type: '' });

  // --- CẤU HÌNH GOOGLE ---
  const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID_RELEASE,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    selectAccount: true,
  });

  // --- CẤU HÌNH FACEBOOK ---
  const [fRequest, fResponse, fPromptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
  });

  const showMsg = (msg, type = 'error') => setToast({ msg, type });

  // Xử lý sau khi nhận được Response từ Google/Facebook
  // useEffect(() => {
  //   if (gResponse?.type === 'success') {
  //     console.log("Google Access Token:", gResponse); // Debug token Google
  //     handleSocialLogin('google', gResponse.authentication.accessToken);
  //   }
  // }, [gResponse]);


  const fetchGoogleInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const info = await res.json();
      
      // Sau khi có info, đóng gói thành DTO gửi về Backend
      await handleSocialLogin({
        email: info.email,
        fullName: info.name,
        provider: 'Google',
        externalId: info.id
      });
    } catch (e) {
      showMsg("Không lấy được thông tin Google");
      setLoading(false);
    }
  };

  // --- HÀM LẤY INFO TỪ FACEBOOK ---
  const fetchFacebookInfo = async (token) => {
    try {
      const res = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`);
      const info = await res.json();
      
      await handleSocialLogin({
        email: info.email || `${info.id}@facebook.com`, // FB đôi khi không trả email nếu user ko public
        fullName: info.name,
        provider: 'Facebook',
        externalId: info.id
      });
    } catch (e) {
      showMsg("Không lấy được thông tin Facebook");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gResponse?.type === 'success') {
      setLoading(true); // Bật loading ngay khi bấm thành công
      fetchGoogleInfo(gResponse.authentication.accessToken);
    } else if (gResponse?.type === 'cancel') {
      setLoading(false);
    }
  }, [gResponse]);

  useEffect(() => {
    if (fResponse?.type === 'success') {
      setLoading(true);
      fetchFacebookInfo(fResponse.authentication.accessToken);
    }
  }, [fResponse]);

  // Hàm dùng chung để gửi Token Social về Backend ASP.NET của ông
  const handleSocialLogin = async (socialDTO) => {
    setLoading(true);
    try {
      // socialDTO lúc này đã khớp hoàn toàn với Class ExternalLoginRequest bên C#
      const response = await userApi.loginSocial(socialDTO);
      const result = await response.json();

      if (response.ok) {
        processLoginSuccess(result);
      } else {
        showMsg(result.message || "Lỗi xác thực phía Server");
      }
    } catch (error) {
      showMsg("Lỗi kết nối Server!");
    } finally {
      setLoading(false);
    }
  };

  // Tách logic xử lý thành công ra để dùng chung cho cả Login thường và Social
  const processLoginSuccess = async (result) => {
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
  };

  const handleLogin = async () => {
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) return showMsg("Vui lòng điền đủ thông tin!");
    setLoading(true);
    try {
      const response = await userApi.login({ username: u, password: p });
      const result = response.headers.get("content-type")?.includes("application/json") 
                     ? await response.json() : { message: await response.text() };

      if (response.ok) {
        processLoginSuccess(result);
      } else {
        setLoading(false);
        showMsg(result.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      showMsg("Lỗi kết nối API!");
    }
  };

  return (
    <View style={styles.container}>
      <TopToast message={toast.msg} type={toast.type} onHide={() => setToast({ msg: '', type: '' })} />
      
      <View style={styles.card}>
        <Text style={styles.headerText}>Chào mừng trở lại</Text>
        <Text style={styles.subText}>Vui lòng nhập thông tin của bạn để đăng nhập.</Text>

        {/* Input Username & Password giữ nguyên... */}
        <Text style={styles.label}>Tên đăng nhập / Email</Text>
        <View style={styles.inputContainer}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nhập tài khoản của bạn" value={username} onChangeText={setUsername} autoCapitalize="none" />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TouchableOpacity><Text style={styles.forgotText}>Quên mật khẩu?</Text></TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nhập mật khẩu của bạn" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
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

        {/* --- CẬP NHẬT NÚT BẤM SOCIAL --- */}
        <View style={styles.socialRow}>
          <TouchableOpacity 
            style={styles.socialBtn} 
            onPress={() => gPromptAsync()} 
            disabled={!gRequest || loading}
          >
             <FontAwesome name="google" size={20} color="black" />
             <Text style={styles.socialBtnText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialBtn} 
            onPress={() => fPromptAsync()} 
            disabled={!fRequest || loading}
          >
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

const styles = StyleSheet.create({
  // Giữ nguyên styles cũ của ông...
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