import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandHeader } from '../components/BrandHeader';
import { FeaturedProductCard, ProductCard } from '../components/ProductCards';
import { colors, shadow } from '../constants/theme';
import { productService } from '../api/productService';
import { useCart } from '../context/CartContext';

const placeholderImage = require('../../assets/placeholder.png');

const communityBlueprints = [
  {
    id: 'community-1',
    title: 'Chia sẻ đón bé về nhà',
    copy: 'Chuẩn bị góc ngủ, bát ăn và lịch sinh hoạt trong 7 ngày đầu để bé quen nhanh hơn.',
    meta: 'Cộng đồng • 12 phản hồi',
    badge: 'Mới',
    icon: 'people-outline',
    tint: '#FFF0E6'
  },
  {
    id: 'community-2',
    title: 'Ảnh từ khách hàng ManaPet',
    copy: 'Những khoảnh khắc nhận bé mới về nhà và cách sắp xếp không gian thật gọn gàng.',
    meta: 'Chia sẻ • 8 phút trước',
    badge: 'Hot',
    icon: 'camera-outline',
    tint: '#FCEED9'
  },
  {
    id: 'community-3',
    title: 'Hỏi nhanh đáp gọn',
    copy: 'Trao đổi nhanh về giống, tính cách và phụ kiện phù hợp trước khi chốt đơn.',
    meta: 'Thảo luận • đang hot',
    badge: 'Q&A',
    icon: 'chatbubbles-outline',
    tint: '#FFE6D8'
  }
];

const knowledgeCards = [
  {
    id: 'knowledge-1',
    title: 'Cách chọn thú cưng phù hợp',
    copy: 'Ưu tiên tuổi, tính cách và không gian sống trước khi quyết định đón bé.',
    meta: '4 phút đọc',
    icon: 'school-outline'
  },
  {
    id: 'knowledge-2',
    title: 'Dấu hiệu bé cần được kiểm tra',
    copy: 'Bỏ ăn, lờ đờ, thở gấp hoặc lông xơ là những tín hiệu nên chú ý sớm.',
    meta: '3 phút đọc',
    icon: 'medkit-outline'
  },
  {
    id: 'knowledge-3',
    title: 'Mẹo giữ không gian sạch sẽ',
    copy: 'Lịch tắm, chải lông và vệ sinh chuồng giúp bé khỏe và nhà cửa gọn hơn.',
    meta: '5 phút đọc',
    icon: 'sparkles-outline'
  }
];

const formatCurrency = (amount) => `${Math.round(amount || 0).toLocaleString('vi-VN')} đ`;

const getCategoryIcon = (name = '') => {
  const value = name.toLowerCase();
  if (value.includes('phụ kiện') || value.includes('accessory')) {
    return 'pricetag-outline';
  }
  if (value.includes('chó') || value.includes('mèo') || value.includes('pet')) {
    return 'paw-outline';
  }
  return 'grid-outline';
};

export default function HomeScreen({ navigation }) {
  const { addToCart } = useCart();
  const mountedRef = useRef(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  const loadHome = async () => {
    setLoading(true);
    setError('');

    try {
      const [apiProducts, apiCategories] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);

      if (!mountedRef.current) return;
      setProducts(apiProducts);
      setCategories(apiCategories);
    } catch (loadError) {
      if (!mountedRef.current) return;
      setProducts([]);
      setCategories([]);
      setError(loadError?.message ?? 'Không thể tải dữ liệu từ API.');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadHome();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      if (selectedCategoryId !== 'all' && product.categoryId !== selectedCategoryId) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const haystack = [
        product.name,
        product.description,
        product.category?.name,
        product.origin,
        product.healthStatus
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [products, search, selectedCategoryId]);

  const categoryCounts = useMemo(() => {
    return products.reduce((accumulator, product) => {
      if (product.categoryId != null) {
        accumulator[product.categoryId] = (accumulator[product.categoryId] ?? 0) + 1;
      }
      return accumulator;
    }, {});
  }, [products]);

  const categoryOptions = useMemo(() => {
    return [
      { id: 'all', name: 'Tất cả', description: 'Mọi danh mục', icon: 'grid-outline', count: products.length },
      ...categories.map((category) => ({
        ...category,
        icon: getCategoryIcon(category.name),
        count: categoryCounts[category.id] ?? 0
      }))
    ];
  }, [categories, categoryCounts, products.length]);

  const communityCards = useMemo(() => {
    return communityBlueprints.map((item, index) => ({
      ...item,
      image: products[index]?.image ?? placeholderImage
    }));
  }, [products]);

  const heroProduct = filteredProducts[0] ?? null;
  const spotlightProduct = filteredProducts.length > 1 ? filteredProducts[1] : null;
  const gridProducts = filteredProducts.length > 2 ? filteredProducts.slice(2, 6) : [];

  const discountCount = useMemo(() => products.filter((item) => item.isDiscount).length, [products]);
  const availableCount = useMemo(() => products.filter((item) => item.stock > 0).length, [products]);

  const stats = [
    { key: 'products', label: 'Sản phẩm', value: products.length, icon: 'cube-outline' },
    { key: 'discount', label: 'Đang giảm', value: discountCount, icon: 'pricetag-outline' },
    { key: 'stock', label: 'Còn hàng', value: availableCount, icon: 'checkmark-circle-outline' }
  ];

  const openProduct = (product) => {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate('ProductDetail', { productId: product.id });
      return;
    }
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategoryId('all');
  };

  return (
    <View style={styles.root}>
      <BrandHeader showSearch={false} onCartPress={() => navigation.navigate('Cart')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color={colors.primary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm thú cưng, phụ kiện hoặc danh mục"
            placeholderTextColor={colors.muted}
            style={styles.input}
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity style={styles.clearButton} onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.key} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Ionicons name={stat.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải dữ liệu từ server...</Text>
          </View>
        ) : (
          <>
            {error ? (
              <View style={styles.errorCard}>
                <View style={styles.errorTopRow}>
                  <Ionicons name="cloud-offline-outline" size={18} color={colors.primary} />
                  <Text style={styles.errorTitle}>Không tải được dữ liệu từ API</Text>
                </View>
                <Text style={styles.errorCopy}>
                  Kiểm tra kết nối hoặc thử tải lại để lấy danh sách mới nhất.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadHome}>
                  <Text style={styles.retryButtonText}>Tải lại</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {heroProduct ? (
              <TouchableOpacity style={styles.heroCard} activeOpacity={0.92} onPress={() => openProduct(heroProduct)}>
                <View style={styles.heroCopy}>
                  <View style={styles.heroPills}>
                    {heroProduct.badge ? (
                      <View style={styles.salePill}>
                        <Text style={styles.salePillText}>{heroProduct.badge}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.heroTitle} numberOfLines={3}>
                    {heroProduct.isDiscount ? 'Ưu đãi hôm nay' : 'Sản phẩm nổi bật'}
                  </Text>
                  <Text style={styles.heroName} numberOfLines={2}>
                    {heroProduct.name}
                  </Text>
                  <Text style={styles.heroDescription} numberOfLines={3}>
                    {heroProduct.description}
                  </Text>

                  <View style={styles.heroMetaRow}>
                    <View style={styles.heroMetaItem}>
                      <Ionicons name="pricetag-outline" size={14} color={colors.primary} />
                      <Text style={styles.heroMetaText}>{formatCurrency(heroProduct.price)}</Text>
                    </View>
                    <View style={styles.heroMetaItem}>
                      <Ionicons name="cube-outline" size={14} color={colors.primary} />
                      <Text style={styles.heroMetaText}>{heroProduct.stock} còn hàng</Text>
                    </View>
                  </View>

                  <View style={styles.heroAction}>
                    <Text style={styles.heroActionText}>Xem chi tiết</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.white} />
                  </View>
                </View>

                <View style={styles.heroVisual}>
                  <Image source={heroProduct.image} style={styles.heroImage} resizeMode="contain" />
                </View>
              </TouchableOpacity>
            ) : null}

            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={styles.sectionTitle}>Danh mục</Text>
                <Text style={styles.sectionSubtitle}>Chạm để lọc nhanh ngay trên trang chủ.</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <Text style={styles.sectionLink}>Xem cửa hàng</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {categoryOptions.map((category) => {
                const active = selectedCategoryId === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryCard, active && styles.categoryCardActive]}
                    onPress={() => setSelectedCategoryId(category.id)}
                    activeOpacity={0.9}
                  >
                    <View style={[styles.categoryIconWrap, active && styles.categoryIconWrapActive]}>
                      <Ionicons name={category.icon} size={18} color={active ? colors.white : colors.primary} />
                    </View>
                    <View style={styles.categoryTextWrap}>
                      <Text style={[styles.categoryName, active && styles.categoryNameActive]} numberOfLines={1}>
                        {category.name}
                      </Text>
                      <Text style={[styles.categoryMeta, active && styles.categoryMetaActive]}>
                        {category.count} sản phẩm
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={styles.sectionTitle}>Cộng đồng</Text>
                <Text style={styles.sectionSubtitle}>Những chia sẻ ngắn và góc nhìn từ người nuôi.</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <Text style={styles.sectionLink}>Khám phá</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.communityRow}>
              {communityCards.map((card) => (
                <View key={card.id} style={[styles.communityCard, { backgroundColor: card.tint }]}>
                  <Image source={card.image} style={styles.communityImage} resizeMode="cover" />
                  <View style={styles.communityBody}>
                    <View style={styles.communityBadge}>
                      <Ionicons name={card.icon} size={13} color={colors.primary} />
                      <Text style={styles.communityBadgeText}>{card.badge}</Text>
                    </View>
                    <Text style={styles.communityTitle} numberOfLines={2}>
                      {card.title}
                    </Text>
                    <Text style={styles.communityCopy} numberOfLines={3}>
                      {card.copy}
                    </Text>
                    <Text style={styles.communityMeta}>{card.meta}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={styles.sectionTitle}>Kiến thức</Text>
                <Text style={styles.sectionSubtitle}>Gợi ý nhanh để chăm bé tốt hơn mỗi ngày.</Text>
              </View>
            </View>

            <View style={styles.knowledgeList}>
              {knowledgeCards.map((card) => (
                <View key={card.id} style={styles.knowledgeCard}>
                  <View style={styles.knowledgeIconWrap}>
                    <Ionicons name={card.icon} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.knowledgeBody}>
                    <Text style={styles.knowledgeTitle}>{card.title}</Text>
                    <Text style={styles.knowledgeCopy}>{card.copy}</Text>
                    <Text style={styles.knowledgeMeta}>{card.meta}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </View>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={styles.sectionTitle}>Gợi ý hôm nay</Text>
                <Text style={styles.sectionSubtitle}>{filteredProducts.length} sản phẩm phù hợp</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <Text style={styles.sectionLink}>Mở shop</Text>
              </TouchableOpacity>
            </View>

            {spotlightProduct ? (
              <FeaturedProductCard product={spotlightProduct} onPress={openProduct} onAdd={addToCart} />
            ) : null}

            {gridProducts.length ? (
              <View style={styles.grid}>
                {gridProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onPress={openProduct} onAdd={addToCart} />
                ))}
              </View>
            ) : null}

            {!heroProduct ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={30} color={colors.primary} />
                <Text style={styles.emptyTitle}>Không có sản phẩm phù hợp</Text>
                <Text style={styles.emptyCopy}>Thử xóa bộ lọc hoặc đổi từ khóa tìm kiếm.</Text>
                <TouchableOpacity style={styles.emptyButton} onPress={resetFilters}>
                  <Text style={styles.emptyButtonText}>Xóa bộ lọc</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 122
  },
  searchBox: {
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    ...shadow
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  clearButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18
  },
  statCard: {
    flex: 1,
    minHeight: 96,
    borderRadius: 22,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    ...shadow
  },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFE9D8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 12
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2
  },
  loadingState: {
    minHeight: 300,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...shadow
  },
  loadingText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800'
  },
  errorCard: {
    borderRadius: 24,
    backgroundColor: '#FFF3EB',
    padding: 16,
    marginBottom: 18
  },
  errorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  errorTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  errorCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 8
  },
  retryButton: {
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900'
  },
  heroCard: {
    minHeight: 268,
    borderRadius: 30,
    backgroundColor: '#FFF5EA',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 22,
    ...shadow
  },
  heroCopy: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center'
  },
  heroPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  salePill: {
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  salePillText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900'
  },
  heroTitle: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 12
  },
  heroName: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    marginTop: 8
  },
  heroDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 10
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16
  },
  heroMetaItem: {
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  heroMetaText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900'
  },
  heroAction: {
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    marginTop: 18
  },
  heroActionText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900'
  },
  heroVisual: {
    width: 136,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8
  },
  heroImage: {
    width: 150,
    height: 220
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 4
  },
  sectionCopy: {
    flex: 1,
    paddingRight: 12
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900'
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4
  },
  sectionLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900'
  },
  categoryRow: {
    gap: 10,
    paddingBottom: 18
  },
  categoryCard: {
    minWidth: 144,
    minHeight: 66,
    borderRadius: 22,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadow
  },
  categoryCardActive: {
    backgroundColor: colors.primary
  },
  categoryIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFE9DA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryIconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.14)'
  },
  categoryTextWrap: {
    flex: 1
  },
  categoryName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900'
  },
  categoryNameActive: {
    color: colors.white
  },
  categoryMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2
  },
  categoryMetaActive: {
    color: 'rgba(255,255,255,0.8)'
  },
  communityRow: {
    gap: 12,
    paddingBottom: 18
  },
  communityCard: {
    width: 236,
    borderRadius: 24,
    overflow: 'hidden',
    ...shadow
  },
  communityImage: {
    width: '100%',
    height: 128,
    backgroundColor: '#F7EEE8'
  },
  communityBody: {
    padding: 14
  },
  communityBadge: {
    minHeight: 26,
    borderRadius: 13,
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start'
  },
  communityBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900'
  },
  communityTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    marginTop: 10
  },
  communityCopy: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 6
  },
  communityMeta: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 10
  },
  knowledgeList: {
    marginBottom: 6
  },
  knowledgeCard: {
    minHeight: 88,
    borderRadius: 22,
    backgroundColor: colors.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    ...shadow
  },
  knowledgeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFE9DA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  knowledgeBody: {
    flex: 1
  },
  knowledgeTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900'
  },
  knowledgeCopy: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 4
  },
  knowledgeMeta: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 8
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 2
  },
  emptyState: {
    minHeight: 220,
    borderRadius: 26,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 4,
    ...shadow
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 12
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8
  },
  emptyButton: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900'
  }
});
