import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    if(Platform.OS === 'web') {
      // Trên web thì dùng confirm đơn giản
      if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        logout();
      }
    } else {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          style: "destructive",
          onPress: () => logout() // Gọi hàm logout từ Context
        }
      ]
    );}
  };

  return (
    <View style={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.username || 'Khách'}</Text>
        <Text style={styles.userRole}>{user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <MenuButton icon="person-outline" title="Chỉnh sửa hồ sơ" />
        <MenuButton icon="reorder-four-outline" title="Đơn hàng của tôi" />
        <MenuButton icon="heart-outline" title="Thú cưng yêu thích" />
        <MenuButton icon="settings-outline" title="Cài đặt" />

        {/* Nút Đăng xuất */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF4D4D" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Component phụ cho các dòng Menu
const MenuButton = ({ icon, title }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={22} color="#A65215" />
    <Text style={styles.menuTitle}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F0' },
  header: { 
    alignItems: 'center', 
    paddingVertical: 40, 
    backgroundColor: 'white', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    elevation: 5
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#F2A365' },
  editBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#A65215', 
    padding: 6, 
    borderRadius: 15 
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#402008', marginTop: 10 },
  userRole: { fontSize: 14, color: '#A65215', marginTop: 2 },
  menuContainer: { padding: 20, marginTop: 10 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10,
  },
  menuTitle: { flex: 1, marginLeft: 15, fontSize: 16, color: '#402008' },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 15, 
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFEBEB'
  },
  logoutText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#FF4D4D', fontWeight: 'bold' },
});