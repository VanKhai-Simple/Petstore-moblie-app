import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandHeader } from '../components/BrandHeader';
import FavoriteProductCard from '../components/FavoriteProductCard';
import { colors, shadow } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { productService } from '../api/productService';

const formatCurrency = (amount) => `${Math.round(amount || 0).toLocaleString('vi-VN')} đ`;

export default function FavoriteScreen({ navigation }) {
  const { favorites, setFavorites } = useAppContext();
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadFavorites = async () => {
      setLoading(true);
      setError('');

      try {
        const products = await productService.getProducts();
        if (!mounted) return;
        setApiProducts(products);
      } catch (loadError) {
        if (!mounted) return;
        setApiProducts([]);
        setError(loadError?.message ?? 'Không thể tải dữ liệu yêu thích.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, []);

  const favoriteProducts = useMemo(() => {
    const favoriteIds = new Set((favorites ?? []).map((item) => item.id).filter(Boolean));
    const favoriteNames = new Set((favorites ?? []).map((item) => item.name).filter(Boolean));
    return apiProducts.filter((product) => favoriteIds.has(product.id) || favoriteNames.has(product.name));
  }, [apiProducts, favorites]);

  const removeFavorite = (item) => {
    setFavorites((favorites ?? []).filter((product) => product.id !== item.id && product.name !== item.name));
  };

  const openProduct = (product) => {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate('ProductDetail', { productId: product.id });
      return;
    }
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <View style={styles.root}>
      <BrandHeader onCartPress={() => navigation.navigate('Cart')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.kickerRow}>
          <Text style={styles.kicker}>YÊU THÍCH</Text>
          <View style={styles.kickerLine} />
        </View>
        <Text style={styles.title}>Sản phẩm đã lưu</Text>
        <Text style={styles.subtitle}>Danh sách được làm mới từ API ManaPet để giá, ảnh và tồn kho luôn đúng.</Text>

        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="cloud-offline-outline" size={17} color={colors.primary} />
            <Text style={styles.errorText}>Không tải được dữ liệu từ API ManaPet.</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải danh sách yêu thích...</Text>
          </View>
        ) : favoriteProducts.length ? (
          favoriteProducts.map((item) => (
            <View key={item.id} style={styles.cardWrap}>
              <FavoriteProductCard item={item} onPress={() => openProduct(item)} formatCurrency={formatCurrency} />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeFavorite(item)}>
                <Ionicons name="heart-dislike-outline" size={17} color={colors.primary} />
                <Text style={styles.removeText}>Bỏ yêu thích</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={34} color={colors.primary} />
            <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
            <Text style={styles.emptyCopy}>Nhấn biểu tượng tim ở sản phẩm để lưu vào màn hình này.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.shopButtonText}>Xem cửa hàng</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 118 },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kicker: { color: colors.primary, fontSize: 14, fontWeight: '900' },
  kickerLine: { width: 32, height: 1, backgroundColor: colors.line },
  title: { color: colors.text, fontSize: 34, lineHeight: 40, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 6, marginBottom: 24 },
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
    minHeight: 260,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...shadow
  },
  loadingText: { color: colors.muted, fontSize: 14, fontWeight: '800' },
  cardWrap: { marginBottom: 4 },
  removeButton: {
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE8D8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: -10,
    marginBottom: 18
  },
  removeText: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  emptyState: {
    minHeight: 320,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    ...shadow
  },
  emptyTitle: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: 12 },
  emptyCopy: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  shopButton: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18
  },
  shopButtonText: { color: colors.white, fontSize: 13, fontWeight: '900' }
});
