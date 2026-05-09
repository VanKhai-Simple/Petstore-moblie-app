import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandHeader } from '../components/BrandHeader';
import { FeaturedProductCard, ProductCard } from '../components/ProductCards';
import { colors, shadow } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { products as fallbackProducts } from '../data/mockProducts';
import { productService } from '../api/productService';

type Product = any;

const baseCategoryOptions = [
  { id: 'all', label: 'All', title: 'Pet Shop', kicker: 'PREMIUM STORE', subtitle: 'Curated essentials for every corner of your companion sanctuary.' },
  { id: 1, label: 'Food', title: 'Dog Food', kicker: 'NOURISHMENT', subtitle: "Curated organic blends for your sanctuary's most loyal companion." },
  { id: 2, label: 'Beds', title: 'Beds & Throws', kicker: 'SANCTUARY REST', subtitle: 'Soft orthopedic comfort, woven layers, and quiet premium resting spaces.' },
  { id: 3, label: 'Dining', title: 'Dining', kicker: 'FEEDING RITUAL', subtitle: 'Sculpted bowls and elevated dining pieces for calm daily routines.' },
  { id: 4, label: 'Toys', title: 'Play', kicker: 'ENRICHMENT', subtitle: 'Gentle textures and thoughtful play pieces for engaged companions.' },
  { id: 5, label: 'Grooming', title: 'Grooming', kicker: 'BOTANICAL CARE', subtitle: 'Clean, calming care rituals with a soft luxury finish.' }
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
      kicker: 'PET SHOP',
      subtitle: category.description ?? 'Premium pet shop products loaded from the live store API.'
    }))
  ];
};

const priceOptions = [
  { key: 'all', label: 'All prices' },
  { key: 'under40', label: 'Under $40' },
  { key: '40to80', label: '$40 - $80' },
  { key: 'over80', label: 'Over $80' }
];

const sortOptions = [
  { key: 'popular', label: 'Popular', shortLabel: 'Popular' },
  { key: 'priceLow', label: 'Price: Low to High', shortLabel: 'Price Low' },
  { key: 'priceHigh', label: 'Price: High to Low', shortLabel: 'Price High' },
  { key: 'rating', label: 'Top Rated', shortLabel: 'Top Rated' },
  { key: 'newest', label: 'Newest Arrivals', shortLabel: 'Newest' },
  { key: 'stock', label: 'Best Availability', shortLabel: 'Stock' }
];

const defaultFilters = {
  categoryId: 'all' as string | number,
  priceKey: 'all',
  minRating: 0,
  inStockOnly: false
};

const sortProducts = (products: Product[], sortKey: string) => {
  const sorted = [...products];

  switch (sortKey) {
    case 'priceLow':
      return sorted.sort((left, right) => left.price - right.price);
    case 'priceHigh':
      return sorted.sort((left, right) => right.price - left.price);
    case 'rating':
      return sorted.sort((left, right) => right.rating - left.rating || right.reviewCount - left.reviewCount);
    case 'newest':
      return sorted.sort((left, right) => right.id - left.id);
    case 'stock':
      return sorted.sort((left, right) => right.stock - left.stock);
    case 'popular':
    default:
      return sorted.sort((left, right) => right.reviewCount - left.reviewCount || right.rating - left.rating);
  }
};

const filterProducts = (products: Product[], filters: typeof defaultFilters) => {
  return products.filter((product) => {
    if (filters.categoryId !== 'all' && product.categoryId !== filters.categoryId) {
      return false;
    }

    if (filters.priceKey === 'under40' && product.price >= 40) {
      return false;
    }

    if (filters.priceKey === '40to80' && (product.price < 40 || product.price > 80)) {
      return false;
    }

    if (filters.priceKey === 'over80' && product.price <= 80) {
      return false;
    }

    if (filters.minRating && product.rating < filters.minRating) {
      return false;
    }

    return !(filters.inStockOnly && product.stock <= 0);
  });
};

const getActiveFilterCount = (filters: typeof defaultFilters) => {
  let count = 0;
  if (filters.categoryId !== 'all') count += 1;
  if (filters.priceKey !== 'all') count += 1;
  if (filters.minRating > 0) count += 1;
  if (filters.inStockOnly) count += 1;
  return count;
};

export function ProductListScreen({ navigation }: any) {
  const { addToCart } = useCart();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [sortKey, setSortKey] = useState('popular');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadStorefront = async () => {
      setLoading(true);
      setError('');

      try {
        const [apiProducts, apiCategories] = await Promise.all([
          productService.getProducts(),
          productService.getCategories()
        ]);

        if (!mounted) {
          return;
        }

        setProducts(apiProducts.length ? apiProducts : fallbackProducts);
        setCategories(apiCategories);
      } catch (loadError: any) {
        if (!mounted) {
          return;
        }

        setProducts(fallbackProducts);
        setCategories([]);
        setError(loadError?.message ?? 'Unable to load live products.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStorefront();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return sortProducts(filterProducts(products, filters), sortKey);
  }, [filters, products, sortKey]);

  const activeFilterCount = getActiveFilterCount(filters);
  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories]);
  const selectedCategory = categoryOptions.find((option) => option.id === filters.categoryId) ?? categoryOptions[0];
  const selectedSort = sortOptions.find((option) => option.key === sortKey) ?? sortOptions[0];
  const heroProducts = visibleProducts.slice(0, 5);
  const sanctuaryProducts = visibleProducts.slice(5);

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

        <View style={styles.controls}>
          <TouchableOpacity style={[styles.pill, activeFilterCount > 0 && styles.pillActive]} onPress={openFilters}>
            <Ionicons name="options-outline" size={18} color={colors.primary} />
            <Text style={styles.pillText}>Filter{activeFilterCount ? ` (${activeFilterCount})` : ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill} onPress={() => setSortOpen(true)}>
            <Ionicons name="swap-vertical-outline" size={18} color={colors.primary} />
            <Text style={styles.pillText}>Sort by:{'\n'}{selectedSort.shortLabel}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{visibleProducts.length} products</Text>
          <Text style={styles.metaText}>{loading ? 'Loading live API' : `Sorted by ${selectedSort.shortLabel}`}</Text>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="cloud-offline-outline" size={17} color={colors.primary} />
            <Text style={styles.errorText}>Live API unavailable. Showing local backup.</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading products from server...</Text>
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
                    <Text style={styles.kicker}>MORE TO LOVE</Text>
                    <View style={styles.kickerLine} />
                  </View>
                  <Text style={styles.sectionTitle}>Complete the Sanctuary</Text>
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
            <Text style={styles.emptyTitle}>No matching products</Text>
            <Text style={styles.emptyCopy}>Try another category, price range, or rating filter.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={resetFilters}>
              <Text style={styles.emptyButtonText}>Reset Filters</Text>
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
              <Text style={styles.sheetKicker}>PET SHOP FILTER</Text>
              <Text style={styles.sheetTitle}>Refine Products</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.filterLabel}>Category</Text>
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

          <Text style={styles.filterLabel}>Price Range</Text>
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

          <Text style={styles.filterLabel}>Shopping Preferences</Text>
          <TouchableOpacity
            style={[styles.preferenceRow, draftFilters.minRating === 4.8 && styles.preferenceActive]}
            onPress={() => setDraftFilters((current: typeof defaultFilters) => ({ ...current, minRating: current.minRating === 4.8 ? 0 : 4.8 }))}
          >
            <View>
              <Text style={styles.preferenceTitle}>Top rated only</Text>
              <Text style={styles.preferenceCopy}>Show products rated 4.8 and above.</Text>
            </View>
            <Ionicons name={draftFilters.minRating === 4.8 ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.preferenceRow, draftFilters.inStockOnly && styles.preferenceActive]}
            onPress={() => setDraftFilters((current: typeof defaultFilters) => ({ ...current, inStockOnly: !current.inStockOnly }))}
          >
            <View>
              <Text style={styles.preferenceTitle}>Available now</Text>
              <Text style={styles.preferenceCopy}>Hide sold-out items from the shop.</Text>
            </View>
            <Ionicons name={draftFilters.inStockOnly ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
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
              <Text style={styles.sheetKicker}>SORT BY</Text>
              <Text style={styles.sheetTitle}>Product Order</Text>
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
  controls: {
    marginTop: 38,
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
