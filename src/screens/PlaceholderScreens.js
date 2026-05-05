import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Hàm helper để tạo nhanh màn hình tạm
const createPlaceholder = (name) => () => (
  <View style={styles.container}>
    <Text style={styles.text}>Màn hình: {name}</Text>
    <Text style={styles.subText}>Team đang phát triển...</Text>
  </View>
);

export const HomeScreen = createPlaceholder('Trang chủ');
export const ShopScreen = createPlaceholder('Cửa hàng');
export const FavoriteScreen = createPlaceholder('Yêu thích');
export const CartScreen = createPlaceholder('Giỏ hàng');
export const ProfileScreen = createPlaceholder('Tài khoản');

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F0' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#A65215' },
  subText: { fontSize: 14, color: '#8C7E74', marginTop: 10 }
});