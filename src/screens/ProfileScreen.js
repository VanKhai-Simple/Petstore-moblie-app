import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BrandHeader } from '../components/BrandHeader';
import { colors, shadow } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { profileService } from '../api/profileService';

const formatCurrency = (amount) => `${Math.round(amount || 0).toLocaleString('vi-VN')} đ`;

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  return new Date(value).toLocaleDateString('vi-VN');
};

export default function ProfileScreen({ navigation }) {
  const { logout, user } = useAppContext();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const [apiProfile, apiOrders] = await Promise.all([
          profileService.getProfile(),
          profileService.getMyOrders()
        ]);

        if (!mounted) return;
        setProfile(apiProfile);
        setOrders(apiOrders);
      } catch (loadError) {
        if (!mounted) return;
        setProfile(null);
        setOrders([]);
        setError(loadError?.message ?? 'Không thể tải hồ sơ từ API.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const displayProfile = useMemo(() => {
    return {
      fullName: profile?.fullName ?? user?.fullName ?? user?.username ?? 'Khách hàng ManaPet',
      username: profile?.username ?? user?.username ?? 'Chưa cập nhật',
      email: profile?.email ?? user?.email ?? 'Chưa cập nhật email',
      phone: profile?.phone ?? user?.phone ?? 'Chưa cập nhật số điện thoại',
      address: profile?.address ?? 'Chưa cập nhật địa chỉ',
      avatar: profile?.avatar ?? require('../../assets/ProfileScreen1.png'),
      birthDate: profile?.birthDate,
      createdAt: profile?.createdAt
    };
  }, [profile, user]);

  return (
    <View style={styles.root}>
      <BrandHeader onCartPress={() => navigation.navigate('Cart')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="cloud-offline-outline" size={17} color={colors.primary} />
            <Text style={styles.errorText}>Không tải được hồ sơ từ API ManaPet.</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileCard}>
              <Image source={displayProfile.avatar} style={styles.avatar} />
              <View style={styles.profileInfo}>
                <Text style={styles.kicker}>TÀI KHOẢN</Text>
                <Text style={styles.name} numberOfLines={2}>{displayProfile.fullName}</Text>
                <Text style={styles.member}>Tham gia: {formatDate(displayProfile.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.panel}>
              <View style={styles.panelHeader}>
                <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
              </View>

              <InfoRow icon="mail-outline" label="Email" value={displayProfile.email} />
              <View style={styles.divider} />
              <InfoRow icon="call-outline" label="Điện thoại" value={displayProfile.phone} />
              <View style={styles.divider} />
              <InfoRow icon="map-pin" label="Địa chỉ" value={displayProfile.address} valueLines={2} />
            </View>

            <View style={styles.panel}>
              <View style={styles.panelHeader}>
                <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
                <Text style={styles.metaText}>Hồ sơ</Text>
              </View>

              <InfoRow icon="person-outline" label="Tên đăng nhập" value={displayProfile.username} />
              <View style={styles.divider} />
              <InfoRow icon="calendar-outline" label="Ngày sinh" value={displayProfile.birthDate ? formatDate(displayProfile.birthDate) : 'Chưa cập nhật'} />
              <View style={styles.divider} />
              <InfoRow icon="time-outline" label="Tham gia" value={formatDate(displayProfile.createdAt)} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
              <TouchableOpacity 
                style={styles.viewAllBtn} 
                onPress={() => navigation.navigate('MyOrders')}
              >
                <Text style={styles.viewAllText}>Xem tất cả</Text>
                {/* <Ionicons name="chevron-forward" size={14} color={colors.primary} /> */}
              </TouchableOpacity>
            </View>

            {orders.slice(0, 3).map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                  <Text style={styles.orderId}>#{order.id}</Text>
                </View>
                <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
                {order.firstProduct ? (
                  <View style={styles.productRow}>
                    <Image source={order.firstProduct.image} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{order.firstProduct.name}</Text>
                      <Text style={styles.productMeta}>{order.details.length} sản phẩm trong đơn</Text>
                    </View>
                  </View>
                ) : null}
                <Text style={styles.totalText}>Tổng tiền: {formatCurrency(order.totalAmount)}</Text>
              </View>
            ))}

            {!orders.length ? (
              <View style={styles.emptyOrders}>
                <Ionicons name="receipt-outline" size={28} color={colors.primary} />
                <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
              </View>
            ) : null}

            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Feather name="log-out" size={18} color={colors.white} />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, valueLines = 1 }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIconWrap}>
          <Ionicons name={icon} size={17} color={colors.primary} />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text
        style={styles.infoValue}
        numberOfLines={valueLines}
        ellipsizeMode={valueLines === 1 ? 'middle' : 'tail'}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 118 },
  errorBanner: {
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#FFE8D8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 18
  },
  errorText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  loadingState: {
    minHeight: 320,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...shadow
  },
  loadingText: { color: colors.muted, fontSize: 14, fontWeight: '800' },
  profileCard: {
    minHeight: 154,
    borderRadius: 28,
    backgroundColor: colors.card,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...shadow
  },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F7EEE8' },
  profileInfo: { flex: 1 },
  kicker: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  name: { color: colors.text, fontSize: 25, lineHeight: 30, fontWeight: '900', marginTop: 6 },
  member: { color: colors.muted, fontSize: 12, fontWeight: '800', marginTop: 6 },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  infoRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 12,
    minWidth: 0
  },
  infoIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFE9DA',
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
    textAlign: 'right',
    minWidth: 0
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 2
  },
  panel: {
    borderRadius: 24,
    backgroundColor: colors.card,
    padding: 18,
    marginTop: 16,
    ...shadow
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  addressText: { color: colors.muted, fontSize: 14, lineHeight: 22, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 14
  },
  metaText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  orderCard: {
    borderRadius: 24,
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 14,
    ...shadow
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: {
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: '#FFE8D8',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  orderId: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  orderDate: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 10 },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  productImage: { width: 58, height: 58, borderRadius: 16, backgroundColor: '#F7EEE8' },
  productInfo: { flex: 1 },
  productName: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '900' },
  productMeta: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  totalText: { color: colors.primary, fontSize: 15, fontWeight: '900', marginTop: 14 },
  emptyOrders: {
    minHeight: 150,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...shadow
  },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  logoutBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.danger,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 22
  },
  logoutText: { color: colors.white, fontSize: 14, fontWeight: '900' }
});
