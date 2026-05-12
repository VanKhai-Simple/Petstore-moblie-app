import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { orderService } from '../api/orderService';
import { useCart } from '../context/CartContext'; // Import để xóa giỏ hàng

export default function CheckoutScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, StatusBar.currentHeight || 0);
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu từ CartScreen truyền sang
  const selectedIds = route.params?.selectedIds || [];
  const totalPrice = route.params?.totalPrice || 0;
  const shippingFee = 0;

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    note: '',
    selectedCartItemIds: selectedIds
  });

  const handlePay = async () => {
    if (!form.fullName.trim() || !form.phoneNumber.trim() || !form.address.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    setLoading(true);
    try {
      // 1. Gọi API Checkout
      const result = await orderService.checkout(form);
      
      // 2. Đồng bộ lại giỏ hàng (Server xóa giỏ -> App gọi refresh để cập nhật về 0)
      await refreshCart();

      // 3. Chuyển sang màn thành công
      navigation.replace('Success', { orderCode: result?.id || '8829471' });
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Thanh toán thất bại. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#402008" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Form nhận hàng */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
          
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nhập tên người nhận" 
            value={form.fullName} 
            onChangeText={t => setForm({...form, fullName: t})} 
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nhập số điện thoại" 
            keyboardType="phone-pad" 
            value={form.phoneNumber} 
            onChangeText={t => setForm({...form, phoneNumber: t})} 
          />

          <Text style={styles.label}>Địa chỉ giao hàng</Text>
          <TextInput 
            style={[styles.input, { height: 70 }]} 
            placeholder="Số nhà, tên đường, phường/xã..." 
            multiline 
            value={form.address} 
            onChangeText={t => setForm({...form, address: t})} 
          />

          <Text style={styles.label}>Ghi chú đơn hàng</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Yêu cầu đặc biệt cho shipper..." 
            value={form.note} 
            onChangeText={t => setForm({...form, note: t})} 
          />
        </View>

        {/* Tóm tắt chi phí */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tạm tính</Text>
            <Text style={styles.rowValue}>{totalPrice.toLocaleString()}đ</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Phí vận chuyển</Text>
            <Text style={styles.rowValue}>Miễn phí</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{(totalPrice + shippingFee).toLocaleString()}đ</Text>
          </View>

          <TouchableOpacity onPress={handlePay} disabled={loading} style={{ marginTop: 25 }}>
            <LinearGradient colors={['#A65215', '#F2A365']} style={styles.btnPay}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPayText}>XÁC NHẬN ĐẶT HÀNG</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDFB' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    paddingBottom: 10,
    backgroundColor: '#FFFDFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F4E3D8'
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FFF5F0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#402008' },
  
  card: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#A65215', marginBottom: 20 },
  label: { fontSize: 13, color: '#888', marginBottom: 5 },
  input: { borderBottomWidth: 1, borderColor: '#F2D8C9', marginBottom: 20, paddingVertical: 8, color: '#402008', fontSize: 15 },
  
  summaryCard: { marginHorizontal: 20, padding: 25, backgroundColor: '#FFF5F0', borderRadius: 25 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#402008', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rowLabel: { color: '#666' },
  rowValue: { fontWeight: '600', color: '#402008' },
  line: { height: 1, backgroundColor: '#F2D8C9', marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#402008' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#A65215' },
  
  btnPay: { padding: 18, borderRadius: 20, alignItems: 'center', elevation: 2 },
  btnPayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
