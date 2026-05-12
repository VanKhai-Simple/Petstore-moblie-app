import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient, API_BASE_URL } from '../api/client';
import { colors, shadow } from '../constants/theme';

const placeholderImage = require('../../assets/placeholder.png');
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const formatCurrency = (amount) => `${Math.round(Number(amount) || 0).toLocaleString('vi-VN')} đ`;

const formatDateTime = (value) => {
  if (!value) return 'Chưa cập nhật';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const resolveImage = (value) => {
  if (!value || typeof value !== 'string' || value === 'string') {
    return placeholderImage;
  }

  const trimmed = value.trim();
  if (!trimmed) return placeholderImage;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return { uri: trimmed };
  }

  if (trimmed.startsWith('/')) {
    return { uri: `${API_ORIGIN}${trimmed}` };
  }

  return { uri: trimmed };
};

const normalizeDetails = (order) => {
  const details = order?.details ?? order?.orderDetails ?? order?.orderItems ?? [];
  if (!Array.isArray(details)) return [];

  return details.map((item, index) => {
    const product = item.product ?? item.mappedProduct ?? {};
    const price = Number(item.price ?? product.price ?? 0);
    const quantity = Number(item.quantity ?? item.qty ?? 1);
    const rawImage = item.image ?? item.mainImage ?? product.mainImage ?? product.imageUrl ?? product.image;

    return {
      id: item.id ?? item.productId ?? product.id ?? index,
      name: item.productName ?? item.name ?? product.productName ?? product.name ?? 'Sản phẩm ManaPet',
      image: rawImage && (typeof rawImage === 'object' || typeof rawImage === 'number') ? rawImage : resolveImage(rawImage),
      price,
      quantity,
      subtotal: Number(item.subtotal ?? item.total ?? price * quantity)
    };
  });
};

const getStatusMeta = (status = '') => {
  const normalized = status.toLowerCase();

  if (normalized.includes('hủy') || normalized.includes('cancel')) {
    return {
      icon: 'close-circle-outline',
      label: status || 'Đã hủy',
      tone: '#FFE3DD',
      color: colors.danger
    };
  }

  if (normalized.includes('giao') || normalized.includes('hoàn') || normalized.includes('complete')) {
    return {
      icon: 'checkmark-circle-outline',
      label: status || 'Hoàn thành',
      tone: '#E6F6E8',
      color: colors.success
    };
  }

  if (normalized.includes('chờ') || normalized.includes('pending')) {
    return {
      icon: 'time-outline',
      label: status || 'Chờ xác nhận',
      tone: '#FFF3D7',
      color: '#C27803'
    };
  }

  return {
    icon: 'cube-outline',
    label: status || 'Đang xử lý',
    tone: '#FFE8D8',
    color: colors.primary
  };
};

export default function OrderDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, StatusBar.currentHeight || 0);
  const { orderId } = route.params ?? {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadOrderDetail = async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const { data } = await apiClient.get(`/Order/Detail/${orderId}`);
      setOrder(data);
    } catch (loadError) {
      setError(loadError?.message ?? 'Không thể tải chi tiết đơn hàng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const products = useMemo(() => normalizeDetails(order), [order]);
  const statusMeta = useMemo(() => getStatusMeta(order?.status), [order?.status]);
  const subtotal = products.reduce((sum, item) => sum + item.subtotal, 0);
  const total = Number(order?.totalAmount ?? subtotal);
  const shippingFee = 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[styles.header, { paddingTop: topInset + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order && !error) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[styles.header, { paddingTop: topInset + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={44} color={colors.primary} />
          <Text style={styles.emptyTitle}>Không tìm thấy đơn hàng</Text>
          <Text style={styles.emptyCopy}>Đơn hàng này chưa có dữ liệu từ server.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrderDetail({ refresh: true })}
            tintColor={colors.primary}
          />
        }
      >
        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="cloud-offline-outline" size={17} color={colors.primary} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {order ? (
          <>
            <LinearGradient
              colors={['#FFF5EC', '#FFE1CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroTop}>
                <View style={styles.heroIcon}>
                  <Ionicons name="receipt-outline" size={28} color={colors.white} />
                </View>
                <View style={[styles.statusPill, { backgroundColor: statusMeta.tone }]}>
                  <Ionicons name={statusMeta.icon} size={15} color={statusMeta.color} />
                  <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
                </View>
              </View>

              <Text style={styles.orderLabel}>MÃ ĐƠN HÀNG</Text>
              <Text style={styles.orderCode}>#KP-{order.id ?? orderId}</Text>
              <View style={styles.heroMetaRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.muted} />
                <Text style={styles.heroMetaText}>{formatDateTime(order.orderDate)}</Text>
              </View>
            </LinearGradient>

            <View style={styles.panel}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
                  <Text style={styles.sectionSubtitle}>Địa chỉ giao hàng</Text>
                </View>
                <View style={styles.sectionIcon}>
                  <Ionicons name="location-outline" size={19} color={colors.primary} />
                </View>
              </View>

              <InfoLine icon="person-outline" label="Người nhận" value={order.fullName || 'Chưa cập nhật'} />
              <View style={styles.divider} />
              <InfoLine icon="call-outline" label="Số điện thoại" value={order.phoneNumber || 'Chưa cập nhật'} />
              <View style={styles.divider} />
              <InfoLine icon="map-outline" label="Địa chỉ" value={order.address || 'Chưa cập nhật'} valueLines={3} />

              {order.note ? (
                <View style={styles.noteBox}>
                  <Ionicons name="chatbubble-ellipses-outline" size={17} color={colors.primary} />
                  <Text style={styles.noteText}>{order.note}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
              <Text style={styles.sectionSubtitle}>{products.length} sản phẩm</Text>
            </View>

            {products.length ? (
              products.map((item) => (
                <View key={item.id} style={styles.productCard}>
                  <Image source={item.image} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productMeta}>
                      {formatCurrency(item.price)} x {item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.productTotal}>{formatCurrency(item.subtotal)}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyProducts}>
                <Ionicons name="bag-outline" size={30} color={colors.primary} />
                <Text style={styles.emptyProductsText}>Chưa có sản phẩm trong đơn này.</Text>
              </View>
            )}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Tóm tắt thanh toán</Text>
              <SummaryRow label="Tạm tính" value={formatCurrency(subtotal || total)} />
              <SummaryRow label="Phí vận chuyển" value={shippingFee ? formatCurrency(shippingFee) : 'Miễn phí'} />
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Thành tiền</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={44} color={colors.primary} />
            <Text style={styles.emptyTitle}>Không tải được đơn hàng</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadOrderDetail()}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoLine({ icon, label, value, valueLines = 1 }) {
  return (
    <View style={styles.infoLine}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIcon}>
          <Ionicons name={icon} size={16} color={colors.primary} />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={valueLines}>
        {value}
      </Text>
    </View>
  );
}

function SummaryRow({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0E5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  headerSpacer: { width: 40 },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: { color: colors.muted, fontSize: 14, fontWeight: '800' },
  errorBanner: {
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#FFE8D8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 16
  },
  errorText: { flex: 1, color: colors.primaryDark, fontSize: 12, lineHeight: 17, fontWeight: '800' },
  heroCard: {
    minHeight: 178,
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    ...shadow
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusPill: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusText: { fontSize: 12, fontWeight: '900' },
  orderLabel: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  orderCode: { color: colors.text, fontSize: 30, lineHeight: 34, fontWeight: '900', marginTop: 6 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12 },
  heroMetaText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  panel: {
    borderRadius: 24,
    backgroundColor: colors.card,
    padding: 18,
    marginBottom: 20,
    ...shadow
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12
  },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  sectionSubtitle: { color: colors.muted, fontSize: 12, fontWeight: '800', marginTop: 4 },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE9DA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoLine: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF0E5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoLabel: { color: colors.text, fontSize: 13, fontWeight: '900' },
  infoValue: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'right'
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 4 },
  noteBox: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: '#FFF6EF',
    padding: 14,
    flexDirection: 'row',
    gap: 10
  },
  noteText: { flex: 1, color: colors.muted, fontSize: 13, lineHeight: 19, fontWeight: '700' },
  productCard: {
    minHeight: 94,
    borderRadius: 22,
    backgroundColor: colors.card,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow
  },
  productImage: { width: 70, height: 70, borderRadius: 18, backgroundColor: '#F7EEE8' },
  productInfo: { flex: 1, minWidth: 0 },
  productName: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '900' },
  productMeta: { color: colors.muted, fontSize: 12, fontWeight: '800', marginTop: 6 },
  productTotal: { color: colors.primary, fontSize: 14, fontWeight: '900' },
  emptyProducts: {
    minHeight: 120,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginBottom: 16,
    ...shadow
  },
  emptyProductsText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  summaryCard: {
    borderRadius: 28,
    backgroundColor: colors.cardWarm,
    padding: 22,
    marginTop: 8,
    ...shadow
  },
  summaryTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginBottom: 18 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  summaryLabel: { color: colors.muted, fontSize: 14, fontWeight: '700' },
  summaryValue: { color: colors.text, fontSize: 14, fontWeight: '900' },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14
  },
  totalLabel: { color: colors.text, fontSize: 17, fontWeight: '900' },
  totalValue: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  emptyState: {
    flex: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28
  },
  emptyTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 12 },
  emptyCopy: { color: colors.muted, fontSize: 13, lineHeight: 18, textAlign: 'center', marginTop: 6 },
  retryButton: {
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  retryText: { color: colors.white, fontSize: 13, fontWeight: '900' }
});
