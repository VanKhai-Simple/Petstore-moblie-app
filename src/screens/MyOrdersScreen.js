import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { profileService } from '../api/profileService'; // Dùng service ông gửi
import { colors } from '../constants/theme';

export default function MyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load lại đơn hàng mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const handleViewDetail = (id) => {
        // Phải truyền dưới dạng object { orderId: id }
        navigation.navigate('OrderDetail', { orderId: id });
    };

  const loadOrders = async () => {
    try {
      if (!isRefreshing) setLoading(true);
      const data = await profileService.getMyOrders(); // Dùng hàm lấy order từ profileService
      
      // Sắp xếp đơn hàng mới nhất lên đầu dựa trên id hoặc orderDate
      const sortedData = data.sort((a, b) => b.id - a.id);
      setOrders(sortedData);
    } catch (e) {
      console.error("Lỗi tải đơn hàng:", e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

 const renderOrder = ({ item }) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <Text style={styles.orderCode}>MÃ ĐƠN: #KP-{item.id}</Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
    
    <View style={styles.productRow}>
      {/* item.firstItem.image đã được xử lý qua resolveImage */}
      <Image 
        source={item.firstItem?.image} 
        style={styles.productImg} 
      />
      
      <View style={styles.orderMid}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.firstItem?.name || 'Sản phẩm ManaPet'}
        </Text>
        
        <Text style={styles.qtyText}>
          Số lượng: {item.firstItem?.quantity || 0}
        </Text>

        <Text style={styles.amountText}>
          Tổng: {item.totalAmount?.toLocaleString('vi-VN')} đ
        </Text>
      </View>
    </View>

    <View style={styles.footerRow}>
      <Text style={styles.orderDate}>
        {new Date(item.orderDate).toLocaleDateString('vi-VN')}
      </Text>
      <TouchableOpacity onPress={() => handleViewDetail(item.id)}>
        <LinearGradient colors={['#A65215', '#F2A365']} style={styles.detailBtn}>
          <Text style={styles.detailBtnText}>Chi tiết</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#402008" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && !isRefreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#A65215" />
          <Text style={styles.loadingText}>Đang tải danh sách đơn hàng...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={() => {
            setIsRefreshing(true);
            loadOrders();
          }}
          refreshing={isRefreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={80} color="#F2D8C9" />
              <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào đâu!</Text>
              <TouchableOpacity 
                style={styles.shopNowBtn}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.shopNowText}>Mua sắm ngay</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#402008' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#A65215', fontWeight: '700' },
  listContent: { padding: 20 },
  orderCard: { backgroundColor: '#fff', borderRadius: 25, padding: 16, marginBottom: 18, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderCode: { fontSize: 12, fontWeight: 'bold', color: '#BBB' },
  statusBadge: { backgroundColor: '#FFF2EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#A65215', fontSize: 11, fontWeight: '900' },
  productRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', paddingBottom: 12 },
  productImg: { width: 70, height: 70, borderRadius: 15, backgroundColor: '#F9F9F9' },
  orderMid: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#402008' },
  orderDate: { fontSize: 12, color: '#999', marginTop: 4 },
  amountText: { fontSize: 15, fontWeight: 'bold', color: '#A65215', marginTop: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  itemCount: { fontSize: 13, color: '#666', fontWeight: '600' },
  detailBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, gap: 5 },
  detailBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', fontSize: 16, marginTop: 15 },
  shopNowBtn: { marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#A65215' },
  shopNowText: { color: '#A65215', fontWeight: 'bold', fontSize: 15 }
});