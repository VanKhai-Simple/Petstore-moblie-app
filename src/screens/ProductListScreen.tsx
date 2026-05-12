import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandHeader } from '../components/BrandHeader';
import { FeaturedProductCard, ProductCard } from '../components/ProductCards';
import { colors, shadow } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { productService } from '../api/productService';

type Product = any;

const baseCategoryOptions = [
  {
    id: 'all',
    label: 'Tất cả',
    title: 'ManaPet Shop',
    kicker: 'CỬA HÀNG THÚ CƯNG',
    subtitle: 'Danh sách sản phẩm và thú cưng được cập nhật hằng ngày.'
  },
  {
    id: 1,
    label: 'Chó cảnh',
    title: 'Chó cảnh',
    kicker: 'CÚN CƯNG',
    subtitle: 'Các bé cún đang có tại ManaPet, kèm thông tin sức khỏe và nguồn gốc.'
  },
  {
    id: 2,
    label: 'Mèo cảnh',
    title: 'Mèo cảnh',
    kicker: 'MÈO CƯNG',
    subtitle: 'Các bé mèo cảnh đang sẵn sàng về nhà mới.'
  }
];

const buildCategoryOptions = (categories: any[]) => {
  if (!categories.length) {
    return baseCategoryOptions;
  }

  return [
    baseCategoryOptions[0],
    ...categories.map((category) => ({
      id: category.id,
      label: category.name,
      title: category.name,
      kicker: 'DANH MỤC',
      subtitle: category.description ?? `Sản phẩm thuộc danh mục ${category.name} trên ManaPet.`
    }))
  ];
};

const priceOptions = [
  { key: 'all', label: 'Tất cả giá' },
  { key: 'under500k', label: 'Dưới 500K' },
  { key: '500kTo1m', label: '500K - 1 triệu' },
  { key: '1mTo3m', label: '1 - 3 triệu' },
  { key: 'over3m', label: 'Trên 3 triệu' }
];

const sortOptions = [
  { key: 'newest', label: 'Mới nhất', shortLabel: 'Mới nhất' },
  { key: 'priceLow', label: 'Giá thấp đến cao', shortLabel: 'Giá thấp' },
  { key: 'priceHigh', label: 'Giá cao đến thấp', shortLabel: 'Giá cao' },
  { key: 'discount', label: 'Giảm giá nhiều nhất', shortLabel: 'Khuyến mãi' },
  { key: 'stock', label: 'Còn hàng nhiều nhất', shortLabel: 'Tồn kho' }
];

const defaultFilters = {
  categoryId: 'all' as string | number,
  priceKey: 'all',
  inStockOnly: false,
  saleOnly: false
};

const sortProducts = (products: Product[], sortKey: string) => {
  const sorted = [...products];

  switch (sortKey) {
    case 'priceLow':
      return sorted.sort((left, right) => left.price - right.price);
    case 'priceHigh':
      return sorted.sort((left, right) => right.price - left.price);
    case 'discount':
      return sorted.sort((left, right) => (right.discountPercent ?? 0) - (left.discountPercent ?? 0));
    case 'newest':
      return sorted.sort(
        (left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
      );
    case 'stock':
      return sorted.sort((left, right) => right.stock - left.stock);
    default:
      return sorted.sort((left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime());
  }
};

const filterProducts = (products: Product[], filters: typeof defaultFilters) => {
  return products.filter((product) => {
    if (filters.categoryId !== 'all' && product.categoryId !== filters.categoryId) {
      return false;
    }

    if (filters.priceKey === 'under500k' && product.price >= 500000) {
      return false;
    }

    if (filters.priceKey === '500kTo1m' && (product.price < 500000 || product.price > 1000000)) {
      return false;
    }

    if (filters.priceKey === '1mTo3m' && (product.price < 1000000 || product.price > 3000000)) {
      return false;
    }

    if (filters.priceKey === 'over3m' && product.price <= 3000000) {
      return false;
    }

    if (filters.inStockOnly && product.stock <= 0) {
      return false;
    }

    return !(filters.saleOnly && !product.isDiscount);
  });
};

const getActiveFilterCount = (filters: typeof defaultFilters) => {
  let count = 0;
  if (filters.categoryId !== 'all') count += 1;
  if (filters.priceKey !== 'all') count += 1;
  if (filters.inStockOnly) count += 1;
  if (filters.saleOnly) count += 1;
  return count;
};

export function ProductListScreen({ navigation }: any) {
  const { addToCart } = useCart();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [sortKey, setSortKey] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const apiCategories = await productService.getCategories();
        if (!mounted) {
          return;
        }
        setCategories(apiCategories);
      } catch {
        if (!mounted) {
          return;
        }
        setCategories([]);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(async () => {
      const keyword = search.trim();
      const isBootstrapping = bootstrapping;

      if (isBootstrapping) {
        setLoading(true);
      } else {
        setSearching(true);
      }

      setError('');

      try {
        const apiProducts = keyword
          ? await productService.searchProducts(keyword)
          : await productService.getProducts();

        if (!mounted) {
          return;
        }

        setProducts(apiProducts);
      } catch (loadError: any) {
        if (!mounted) {
          return;
        }

        setProducts([]);
        setError(loadError?.message ?? 'Không thể tải sản phẩm từ API.');
      } finally {
        if (mounted) {
          setLoading(false);
          setSearching(false);
          setBootstrapping(false);
        }
      }
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [search]);

  const visibleProducts = useMemo(() => {
    return sortProducts(filterProducts(products, filters), sortKey);
  }, [filters, products, sortKey]);

  const activeFilterCount = getActiveFilterCount(filters);
  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories]);
  const selectedCategory = categoryOptions.find((option) => option.id === filters.categoryId) ?? categoryOptions[0];
  const selectedSort = sortOptions.find((option) => option.key === sortKey) ?? sortOptions[0];
  const heroProducts = visibleProducts.slice(0, 5);
  const sanctuaryProducts = visibleProducts.slice(5);
  const searchTerm = search.trim();

  const openProduct = (product: Product) => {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate('ProductDetail', { productId: product.id });
      return;
    }
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const openFilters = () => {
    setDraftFilters(filters);
    setFilterOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);
    setFilters(defaultFilters);
    setSearch('');
    setFilterOpen(false);
  };

  return (
    <View style={styles.root}>
      <BrandHeader onCartPress={() => navigation.navigate('Cart')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.kickerRow}>
          <Text style={styles.kicker}>{selectedCategory.kicker}</Text>
          <View style={styles.kickerLine} />
        </View>
        <Text style={styles.title}>{selectedCategory.title}</Text>
        <Text style={styles.subtitle}>{selectedCategory.subtitle}</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.primary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm sản phẩm"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity style={styles.searchClear} onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {searching ? (
          <View style={styles.searchingBanner}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.searchingText}>Đang tìm sản phẩm...</Text>
          </View>
        ) : null}

        <View style={styles.controls}>
          <TouchableOpacity style={[styles.pill, activeFilterCount > 0 && styles.pillActive]} onPress={openFilters}>
            <Ionicons name="options-outline" size={18} color={colors.primary} />
            <Text style={styles.pillText}>Bộ lọc{activeFilterCount ? ` (${activeFilterCount})` : ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill} onPress={() => setSortOpen(true)}>
            <Ionicons name="swap-vertical-outline" size={18} color={colors.primary} />
            <Text style={styles.pillText}>Sắp xếp:{'\n'}{selectedSort.shortLabel}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{visibleProducts.length} sản phẩm</Text>
          <Text style={styles.metaText}>
            {loading ? 'Đang tải API' : searching ? 'Đang tìm...' : searchTerm ? `Kết quả cho "${searchTerm}"` : `Theo ${selectedSort.shortLabel}`}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="cloud-offline-outline" size={17} color={colors.primary} />
            <Text style={styles.errorText}>Không tải được dữ liệu từ API ManaPet.</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải sản phẩm từ server...</Text>
          </View>
        ) : visibleProducts.length ? (
          <>
            <View style={styles.grid}>
              {heroProducts.slice(0, 2).map((product) => (
                <ProductCard key={product.id} product={product} onPress={openProduct} onAdd={addToCart} />
              ))}
            </View>
            {heroProducts[2] ? (
              <FeaturedProductCard product={heroProducts[2]} onPress={openProduct} onAdd={addToCart} />
            ) : null}
            <View style={styles.grid}>
              {heroProducts.slice(3).map((product) => (
                <ProductCard key={product.id} product={product} onPress={openProduct} onAdd={addToCart} />
              ))}
            </View>

            {sanctuaryProducts.length ? (
              <>
                <View style={styles.sectionHeader}>
                  <View style={styles.kickerRow}>
                    <Text style={styles.kicker}>GỢI Ý THÊM</Text>
                    <View style={styles.kickerLine} />
                  </View>
                  <Text style={styles.sectionTitle}>Thêm lựa chọn</Text>
                </View>
                <View style={styles.grid}>
                  {sanctuaryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onPress={openProduct} onAdd={addToCart} />
                  ))}
                </View>
              </>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={28} color={colors.primary} />
            <Text style={styles.emptyTitle}>Không có sản phẩm phù hợp</Text>
            <Text style={styles.emptyCopy}>
              {searchTerm
                ? `Không có sản phẩm khớp với "${searchTerm}". Hãy thử từ khóa khác hoặc xóa bộ lọc.`
                : 'Thử đổi danh mục, khoảng giá hoặc trạng thái còn hàng.'}
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={resetFilters}>
              <Text style={styles.emptyButtonText}>Xóa bộ lọc</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={filterOpen}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        categoryOptions={categoryOptions}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
      />
      <SortModal visible={sortOpen} sortKey={sortKey} onClose={() => setSortOpen(false)} onSelect={(key: string) => {
        setSortKey(key);
        setSortOpen(false);
      }} />
    </View>
  );
}

function FilterModal({ visible, draftFilters, setDraftFilters, categoryOptions, onClose, onApply, onReset }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalScrim} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetKicker}>BỘ LỌC MANAPET</Text>
              <Text style={styles.sheetTitle}>Lọc sản phẩm</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.filterLabel}>Danh mục</Text>
          <View style={styles.chipWrap}>
            {categoryOptions.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.chip, draftFilters.categoryId === option.id && styles.chipActive]}
                onPress={() => setDraftFilters((current: typeof defaultFilters) => ({ ...current, categoryId: option.id }))}
              >
                <Text style={[styles.chipText, draftFilters.categoryId === option.id && styles.chipTextActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>Khoảng giá</Text>
          <View style={styles.chipWrap}>
            {priceOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.chip, draftFilters.priceKey === option.key && styles.chipActive]}
                onPress={() => setDraftFilters((current: typeof defaultFilters) => ({ ...current, priceKey: option.key }))}
              >
                <Text style={[styles.chipText, draftFilters.priceKey === option.key && styles.chipTextActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>Trạng thái</Text>
          <TouchableOpacity
            style={[styles.preferenceRow, draftFilters.inStockOnly && styles.preferenceActive]}
            onPress={() => setDraftFilters((current: typeof defaultFilters) => ({ ...current, inStockOnly: !current.inStockOnly }))}
          >
            <View>
              <Text style={styles.preferenceTitle}>Còn hàng</Text>
              <Text style={styles.preferenceCopy}>Ẩn các sản phẩm đã hết hàng.</Text>
            </View>
            <Ionicons name={draftFilters.inStockOnly ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.preferenceRow, draftFilters.saleOnly && styles.preferenceActive]}
            onPress={() => setDraftFilters((current: typeof defaultFilters) => ({ ...current, saleOnly: !current.saleOnly }))}
          >
            <View>
              <Text style={styles.preferenceTitle}>Đang khuyến mãi</Text>
              <Text style={styles.preferenceCopy}>Chỉ hiển thị sản phẩm có giảm giá.</Text>
            </View>
            <Ionicons name={draftFilters.saleOnly ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Xóa lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SortModal({ visible, sortKey, onClose, onSelect }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalScrim} activeOpacity={1} onPress={onClose} />
        <View style={styles.sortSheet}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetKicker}>SẮP XẾP THEO</Text>
              <Text style={styles.sheetTitle}>Sắp xếp</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {sortOptions.map((option) => (
            <TouchableOpacity key={option.key} style={styles.sortRow} onPress={() => onSelect(option.key)}>
              <Text style={[styles.sortText, sortKey === option.key && styles.sortTextActive]}>{option.label}</Text>
              {sortKey === option.key ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 118
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900'
  },
  kickerLine: {
    width: 32,
    height: 1,
    backgroundColor: colors.line
  },
  title: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 45,
    fontWeight: '900',
    marginTop: 10
  },
  subtitle: {
    width: '88%',
    color: colors.muted,
    fontSize: 17,
    lineHeight: 27,
    marginTop: 6
  },
  searchBox: {
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 12,
    ...shadow
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  searchClear: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchingBanner: {
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: '#FFF2EA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 12
  },
  searchingText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800'
  },
  controls: {
    marginTop: 22,
    marginBottom: 14,
    flexDirection: 'row',
    gap: 14
  },
  pill: {
    flex: 1,
    minHeight: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...shadow
  },
  pillActive: {
    backgroundColor: '#FFE8D8'
  },
  pillText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800'
  },
  metaRow: {
    marginBottom: 26,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800'
  },
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
  errorText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800'
  },
  loadingState: {
    minHeight: 260,
    borderRadius: 30,
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
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  sectionHeader: {
    marginTop: 36,
    marginBottom: 24
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    marginTop: 8
  },
  emptyState: {
    minHeight: 320,
    borderRadius: 30,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    ...shadow
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59, 31, 11, 0.34)'
  },
  sheet: {
    maxHeight: '86%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28
  },
  sortSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginBottom: 18
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  sheetKicker: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 14
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  chip: {
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800'
  },
  chipTextActive: {
    color: colors.white
  },
  preferenceRow: {
    minHeight: 70,
    borderRadius: 20,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  preferenceActive: {
    backgroundColor: '#FFE8D8'
  },
  preferenceTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  preferenceCopy: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18
  },
  resetButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  applyButton: {
    flex: 1.4,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900'
  },
  sortRow: {
    minHeight: 56,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    marginBottom: 10
  },
  sortText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800'
  },
  sortTextActive: {
    color: colors.text
  }
});
