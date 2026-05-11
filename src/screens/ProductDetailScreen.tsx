import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandHeader } from '../components/BrandHeader';
import { BottomTabs, TabKey } from '../components/BottomTabs';
import { colors, shadow } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { useAppContext } from '../context/AppContext';
import { productService } from '../api/productService';
import FavoriteProductCard from '../components/FavoriteProductCard';

type Product = any;

const formatCurrency = (amount: number) => `${Math.round(amount || 0).toLocaleString('vi-VN')} đ`;

const getProductDetail = (product: Product) => {
  return {
    breadcrumb: `Cửa hàng › ${product.category?.name || 'Sản phẩm'} › ${product.name}`,
    heroColor: '#FAF8F3',
    heroFit: 'contain',
    tabs: ['Mô tả', 'Thông tin', `Đánh giá\n(${product.reviewCount || 0})`],
    longCopy: product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.',
    checks: [
      product.stock > 0 ? `Còn ${product.stock} sản phẩm trong kho` : 'Hiện tại đã hết hàng',
      product.category?.name ? `Danh mục: ${product.category.name}` : 'Sản phẩm chính hãng',
      product.isDiscount ? 'Sản phẩm đang được giảm giá' : 'Chất lượng đảm bảo',
      product.badge ? `Ưu đãi: ${product.badge}` : 'Sẵn sàng giao hàng'
    ],
    curatedTitle: 'Có thể bạn sẽ thích'
  };
};

export function ProductDetailScreen({ navigation, route }: any) {
  const { addToCart, itemCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const productId = route?.params?.productId;
  const [product, setProduct] = useState<Product | null>(null);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>([]);
  
  const { favorites, setFavorites } = useAppContext();
  const isFavorite = favorites?.find((p: any) => p.id === product?.id || p.name === product?.name);

  const toggleFavorite = () => {
    if (!product || !favorites) return;
    if (isFavorite) {
      setFavorites(favorites.filter((p: any) => p.id !== product.id && p.name !== product.name));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const detail = useMemo(() => product ? getProductDetail(product) : null, [product]);
  
  const curated = useMemo(() => {
    if (!product || curatedProducts.length === 0) return [];
    const sameCategory = curatedProducts.filter((item) => item.id !== product.id && item.categoryId === product.categoryId);
    const otherCategories = curatedProducts.filter((item) => item.id !== product.id && item.categoryId !== product.categoryId);
    return [...sameCategory, ...otherCategories].slice(0, 4);
  }, [curatedProducts, product]);

  useEffect(() => {
    let mounted = true;
    setQuantity(1);
    setLoading(true);
    setError('');

    const loadProduct = async () => {
      try {
        const [apiProduct, apiProducts] = await Promise.all([
          productService.getProduct(productId),
          productService.getProducts()
        ]);

        if (!mounted) {
          return;
        }

        setProduct(apiProduct);
        setCuratedProducts(apiProducts || []);
      } catch (loadError: any) {
        if (!mounted) {
          return;
        }

        setError(loadError?.message ?? 'Không thể tải dữ liệu sản phẩm.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      loadProduct();
    } else {
      setLoading(false);
      setError('Không tìm thấy sản phẩm.');
    }

    return () => {
      mounted = false;
    };
  }, [productId]);

  const addSelected = () => {
    if (product) {
      addToCart(product, quantity);
      navigation.navigate('MainTabs', { screen: 'Cart' });
    }
  };

  const handleTabPress = (tab: TabKey) => {
    navigation.navigate('MainTabs', { screen: tab });
  };

  return (
    <View style={styles.root}>
      <BrandHeader showSearch={false} onCartPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color={colors.primary} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        {loading ? (
          <View style={styles.loadingBanner}>
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
          </View>
        ) : null}
        
        {product && detail && (
          <>
            <View style={[styles.heroWrap, { backgroundColor: detail.heroColor }]}>
              <Image
                source={product.image as ImageSourcePropType}
                style={[styles.heroImage]}
                resizeMode={detail.heroFit as any}
              />
              <TouchableOpacity style={styles.heroHeart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={colors.primary || "#C86B2A"} />
              </TouchableOpacity>
              {product.badge ? (
                <View style={[styles.heroBadge, product.badge === 'LOW STOCK' && styles.heroBadgeWarning]}>
                  <Text style={styles.heroBadgeText}>{product.badge}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.breadcrumb}>{detail.breadcrumb}</Text>
            <Text style={styles.title}>{product.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
              <Text style={styles.rating}>★ {product.rating ? product.rating.toFixed(1) : '0.0'} ({product.reviewCount || 0} đánh giá)</Text>
            </View>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.quantityBar}>
              <TouchableOpacity onPress={() => setQuantity((value) => Math.max(1, value - 1))}>
                <Ionicons name="remove" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity((value) => value + 1)}>
                <Ionicons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.9} onPress={addSelected}>
              <LinearGradient colors={['#B85B0B', '#FF9D65']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
                <Ionicons name="cart-outline" size={18} color={colors.white} />
                <Text style={styles.addText}>Thêm vào giỏ</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.tabs}>
              {detail.tabs.map((tab: string, index: number) => (
                <Text key={tab} style={[styles.tab, index === 0 && styles.tabActive]}>
                  {tab}
                </Text>
              ))}
            </View>
            <Text style={styles.longCopy}>{detail.longCopy}</Text>
            
            {detail.checks.map((item: string) => (
              <View key={item} style={styles.checkRow}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}

            <Text style={styles.curatedLabel}>GỢI Ý CHO BẠN</Text>
            <Text style={styles.curatedTitle}>{detail.curatedTitle}</Text>
            {curated.map((item) => (
              <FavoriteProductCard
                key={item.id}
                item={item}
                onPress={() => navigation.push('ProductDetail', { productId: item.id })}
                formatCurrency={formatCurrency}
              />
            ))}
          </>
        )}
      </ScrollView>
      <BottomTabs active="Shop" cartCount={itemCount} onPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 112 },
  errorBanner: {
    minHeight: 38,
    borderRadius: 19,
    backgroundColor: '#FFE8D8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 12
  },
  errorText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  loadingBanner: {
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  loadingText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  heroWrap: {
    width: '100%',
    aspectRatio: 0.82,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroImage: { width: '100%', height: '100%' },
  heroImageNest: { height: '135%' },
  heroHeart: {
    position: 'absolute',
    top: 16,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow
  },
  heroBadge: {
    position: 'absolute',
    left: 18,
    top: 16,
    minHeight: 26,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#A7F39B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroBadgeWarning: { backgroundColor: '#FF7957' },
  heroBadgeText: { color: colors.text, fontSize: 11, fontWeight: '900' },
  breadcrumb: { color: colors.muted, fontSize: 11, fontWeight: '800', marginTop: 28 },
  title: { color: colors.text, fontSize: 29, lineHeight: 31, fontWeight: '900', marginTop: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  price: { color: colors.primary, fontSize: 22, fontWeight: '900' },
  rating: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21, fontWeight: '600', marginTop: 18 },
  quantityBar: {
    height: 48,
    borderRadius: 24,
    marginTop: 22,
    paddingHorizontal: 20,
    backgroundColor: '#FFEFE5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  quantity: { color: colors.text, fontSize: 16, fontWeight: '900' },
  addButton: { height: 50, borderRadius: 25, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, ...shadow },
  addText: { color: colors.white, fontSize: 14, fontWeight: '900' },
  tabs: { marginTop: 42, height: 55, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line },
  tab: { flex: 1, color: colors.muted, textAlign: 'center', fontSize: 12, fontWeight: '800' },
  tabActive: { color: colors.text, borderBottomWidth: 2, borderBottomColor: colors.primary },
  longCopy: { color: colors.muted, fontSize: 14, lineHeight: 22, fontWeight: '700', marginTop: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  checkText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  curatedLabel: { color: colors.primary, fontSize: 10, fontWeight: '900', marginTop: 52 },
  curatedTitle: { color: colors.text, fontSize: 26, lineHeight: 28, fontWeight: '900', marginTop: 6, marginBottom: 18 }
});
