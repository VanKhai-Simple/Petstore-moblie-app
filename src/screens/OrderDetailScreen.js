import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  ActivityIndicator, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../api/client'; // Đảm bảo đã import apiClient để dùng Token

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      // Gọi API lấy chi tiết từ Backend
      const { data } = await apiClient.get(`/Order/Detail/${orderId}`);
      setOrder(data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#A65215" /></View>
  );

  if (!order) return (
    <View style={styles.center}><Text>Không tìm thấy dữ liệu đơn hàng.</Text></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#402008" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Card Trạng thái */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconBox}>
            <Ionicons name="receipt" size={30} color="#fff" />
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.orderIdText}>Mã đơn: #KP-{order.id}</Text>
            <Text style={styles.statusText}>{order.status}</Text>
            <Text style={styles.dateText}>
              {new Date(order.orderDate).toLocaleString('vi-VN')}
            </Text>
          </View>
        </View>

        {/* Thông tin khách hàng */}
        <View style={styles.infoBox}>
          <View style={styles.boxHeader}>
            <Ionicons name="location" size={20} color="#A65215" />
            <Text style={styles.boxTitle}>Địa chỉ nhận hàng</Text>
          </View>
          <Text style={styles.infoName}>{order.fullName}</Text>
          <Text style={styles.infoSub}>{order.phoneNumber}</Text>
          <Text style={styles.infoSub}>{order.address}</Text>
          {order.note ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>Ghi chú: {order.note}</Text>
            </View>
          ) : null}
        </View>

        {/* Danh sách sản phẩm */}
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
          {order.details?.map((item, index) => (
            <View key={index} style={styles.productItem}>
              {/* Lấy mainImage trực tiếp từ item */}
              <Image source={{ uri: item.mainImage }} style={styles.prodImg} />
              <View style={styles.prodInfo}>
                <Text style={styles.prodName} numberOfLines={2}>{item.productName}</Text>
                <Text style={styles.prodPrice}>
                  {item.price?.toLocaleString()}đ x {item.quantity}
                </Text>
              </View>
              <Text style={styles.prodSubtotal}>
                {(item.price * item.quantity).toLocaleString()}đ
              </Text>
            </View>
          ))}
        </View>

        {/* Tóm tắt thanh toán */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền hàng</Text>
            <Text style={styles.summaryValue}>{order.totalAmount?.toLocaleString()}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>0đ</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Thành tiền</Text>
            <Text style={styles.totalValue}>{order.totalAmount?.toLocaleString()}đ</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#402008' },
  
  statusCard: { flexDirection: 'row', alignItems: 'center', margin: 20, padding: 20, backgroundColor: '#FFF5F0', borderRadius: 25 },
  statusIconBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#A65215', justifyContent: 'center', alignItems: 'center' },
  orderIdText: { fontSize: 14, color: '#888', fontWeight: 'bold' },
  statusText: { fontSize: 20, fontWeight: '900', color: '#A65215', marginVertical: 2 },
  dateText: { fontSize: 12, color: '#A65215', opacity: 0.7 },

  infoBox: { marginHorizontal: 20, padding: 20, backgroundColor: '#fff', borderRadius: 25, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  boxHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  boxTitle: { fontSize: 16, fontWeight: 'bold', color: '#402008' },
  infoName: { fontSize: 16, fontWeight: 'bold', color: '#402008', marginBottom: 4 },
  infoSub: { fontSize: 14, color: '#666', marginBottom: 2 },
  noteBox: { marginTop: 10, padding: 10, backgroundColor: '#F9F9F9', borderRadius: 10, borderLeftWidth: 3, borderLeftColor: '#A65215' },
  noteText: { fontSize: 13, color: '#888', fontStyle: 'italic' },

  productSection: { marginTop: 20, marginHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#402008', marginBottom: 15 },
  productItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 20, marginBottom: 10 },
  prodImg: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#F5F5F5' },
  prodInfo: { flex: 1, marginLeft: 12 },
  prodName: { fontSize: 14, fontWeight: 'bold', color: '#402008' },
  prodPrice: { fontSize: 12, color: '#888', marginTop: 4 },
  prodSubtotal: { fontWeight: 'bold', color: '#A65215', fontSize: 14 },

  summaryBox: { marginTop: 10, marginHorizontal: 20, padding: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#888', fontSize: 14 },
  summaryValue: { color: '#402008', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#402008' },
  totalValue: { fontSize: 22, fontWeight: '900', color: '#A65215' }
});