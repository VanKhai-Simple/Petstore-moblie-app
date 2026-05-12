import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SuccessScreen({ route, navigation }) {
  const code = route.params?.orderCode || '8829471';

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }} style={styles.icon} />
      </View>
      <Text style={styles.title}>Thanh toán thành công!</Text>
      <Text style={styles.msg}>Cảm ơn bạn đã tin tưởng Kindred Paws. Đơn hàng của bạn đã được tiếp nhận.</Text>
      <Text style={styles.code}>Mã đơn: #KP-{code}</Text>

      <TouchableOpacity style={{width: '100%', marginTop: 30}} onPress={() => navigation.navigate('MyOrders')}>
        <LinearGradient colors={['#A65215', '#F2A365']} style={styles.btn}>
          <Text style={styles.btnText}>Theo dõi đơn hàng</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={{marginTop: 20}} onPress={() => navigation.navigate('MainTabs')}>
        <Text style={{color: '#A65215', fontWeight: 'bold'}}>Tiếp tục mua sắm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDFB', alignItems: 'center', justifyContent: 'center', padding: 30 },
  circle: { width: 120, height: 120, backgroundColor: '#FFF5F0', borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  icon: { width: 80, height: 80 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#402008' },
  msg: { textAlign: 'center', color: '#888', marginTop: 10, lineHeight: 20 },
  code: { marginTop: 15, fontWeight: 'bold', color: '#A65215' },
  btn: { padding: 16, borderRadius: 20, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});