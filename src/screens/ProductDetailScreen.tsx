import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandHeader } from '../components/BrandHeader';
import { BottomTabs, TabKey } from '../components/BottomTabs';
import { colors, shadow } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { products as fallbackProducts } from '../data/mockProducts';
import { productService } from '../api/productService';

type Product = any;

const categoryDetails: Record<number, any> = {
  1: {
    breadcrumb: 'Shop › Nourishment',
    optionLabel: 'FORMULA',
    swatches: ['#FDF1E6', '#E5B06F', '#8C4B19', '#2E3132'],
    variants: ['Daily', 'Classic', 'Family'],
    activeVariant: 'Classic',
    heroColor: '#F9EEE7',
    heroFit: 'cover',
    benefits: [
      { icon: 'restaurant-outline', label: 'Human-grade\nIngredients' },
      { icon: 'leaf-outline', label: 'Sensitive\nDigestion' }
    ],
    tabs: ['Description', 'Feeding\nGuide', 'Reviews'],
    curatedTitle: 'Complete the\nBowl'
  },
  2: {
    breadcrumb: 'Shop › Beds',
    optionLabel: 'ATMOSPHERE',
    swatches: ['#FDF1E6', '#DDF4DF', '#F0F4E6', '#2E3132'],
    variants: ['Petite', 'Classic', 'Grand'],
    activeVariant: 'Classic',
    heroColor: '#A9CFC8',
    heroFit: 'cover',
    benefits: [
      { icon: 'car-outline', label: 'Free Express\nShipping' },
      { icon: 'leaf-outline', label: '100% Recycled\nFibers' }
    ],
    tabs: ['Description', 'Care\nInstructions', 'Reviews'],
    curatedTitle: 'Complete the\nSanctuary'
  },
  3: {
    breadcrumb: 'Shop › Dining',
    optionLabel: 'FINISH',
    swatches: ['#E7EEF1', '#F8F2E8', '#1F3442', '#D99B40'],
    variants: ['Single', 'Classic', 'Duo'],
    activeVariant: 'Duo',
    heroColor: '#FAF8F3',
    heroFit: 'contain',
    benefits: [
      { icon: 'water-outline', label: 'Dishwasher\nSafe' },
      { icon: 'shield-checkmark-outline', label: 'Weighted\nBase' }
    ],
    tabs: ['Description', 'Care\nGuide', 'Reviews'],
    curatedTitle: 'Refine the\nRitual'
  },
  4: {
    breadcrumb: 'Shop › Play',
    optionLabel: 'PLAY STYLE',
    swatches: ['#F6CF26', '#1597B8', '#E96A28', '#2E3132'],
    variants: ['Gentle', 'Classic', 'Tough'],
    activeVariant: 'Classic',
    heroColor: '#1B1B1B',
    heroFit: 'cover',
    benefits: [
      { icon: 'leaf-outline', label: 'Organic\nCotton' },
      { icon: 'sparkles-outline', label: 'Enrichment\nFocused' }
    ],
    tabs: ['Description', 'Play\nGuide', 'Reviews'],
    curatedTitle: 'Curated for\nPlay'
  },
  5: {
    breadcrumb: 'Shop › Grooming',
    optionLabel: 'RITUAL',
    swatches: ['#B8DACE', '#F8D7C2', '#F6F0E2', '#693F2A'],
    variants: ['Calm', 'Classic', 'Deep'],
    activeVariant: 'Calm',
    heroColor: '#B8DACE',
    heroFit: 'cover',
    benefits: [
      { icon: 'flower-outline', label: 'Botanical\nBlend' },
      { icon: 'heart-outline', label: 'Coat\nSoftening' }
    ],
    tabs: ['Description', 'Ritual\nSteps', 'Reviews'],
    curatedTitle: 'Calm Care\nPairings'
  }
};

const productDetails: Record<number, any> = {
  1: {
    shortName: 'Wilderness Salmon',
    longCopy:
      'Wilderness Salmon Blend is built around clean salmon protein, garden botanicals, and a slow-baked texture that keeps every bowl crisp and aromatic. It supports glossy coats, steady energy, and an elevated everyday feeding ritual.',
    checks: ['Wild salmon protein base', 'Botanical fiber for digestion', 'No wheat, soy, or filler grains', 'Small-batch baked texture']
  },
  2: {
    shortName: 'Puppy Feast',
    longCopy:
      'Grain-Free Puppy Feast is a gentle first-year recipe with clean protein, sweet potato, and coat-supporting nutrients. The bite size is designed for young companions while keeping the ingredient list calm and intentional.',
    checks: ['Puppy-sized tender kibble', 'Sweet potato energy support', 'Glossy coat nutrient blend', 'Gentle on developing digestion']
  },
  3: {
    shortName: 'Harvest Venison',
    longCopy:
      'Harvest Venison & Sweet Potato brings a richer chef-inspired profile to the bowl. Lean venison, slow roasted vegetables, and a soft high-protein finish make it a refined choice for active dogs who need satisfying nourishment.',
    checks: ['Lean venison protein', 'Sweet potato slow energy', 'High-protein serving format', 'Rich flavor without heavy fillers']
  },
  4: {
    shortName: 'Senior Vitality',
    longCopy:
      'Senior Care Vitality Mix is designed for older companions who need daily support without a heavy meal. Joint-friendly minerals, gentle botanicals, and a balanced texture help maintain comfort, mobility, and appetite.',
    checks: ['Senior-focused mineral support', 'Joint comfort nutrients', 'Gentle botanical blend', 'Balanced daily vitality formula']
  },
  5: {
    shortName: 'Freeze-Dried Beef',
    longCopy:
      'Raw Freeze-Dried Beef delivers a concentrated raw-inspired recipe with a premium beef profile. It is prepared for nutrient density, deep aroma, and easy serving as a meal topper or complete bowl upgrade.',
    checks: ['Premium beef ingredient profile', 'Freeze-dried nutrient density', 'Works as topper or meal base', 'Deep aroma for selective eaters']
  },
  6: {
    shortName: 'Atlantic Salmon',
    longCopy:
      'Wild Atlantic Salmon Kibble is a larger pantry bag for sensitive digestion and everyday shine. Salmon and sweet potato create a calm, grain-free base with enough substance for steady daily feeding.',
    checks: ['Grain-free salmon recipe', 'Sensitive digestion support', 'Large 12kg pantry format', 'Omega-rich coat support']
  },
  7: {
    shortName: 'Cloud-Touch Nest',
    longCopy:
      'Experience the pinnacle of pet comfort. The Cloud-Touch Orthopedic Nest is engineered to relieve joint pressure and promote deeper rest. Inside, layered memory foam cushions the body, while the outside uses a stain-resistant woven textile that blends into premium interiors.',
    checks: ['Machine washable cover', 'Non-slip base for hardwood', 'Reinforced stitched seams', 'Odor-neutralizing layer']
  },
  8: {
    shortName: 'Cloud-Soothe Bed',
    longCopy:
      'Cloud-Soothe Orthopedic Bed is a deeper lounge profile for pets who like to curl into supportive bolsters. The cushioned sides create a sheltered rest zone, while the orthopedic base keeps pressure off shoulders, hips, and tired joints.',
    checks: ['Deep bolster comfort wall', 'Orthopedic pressure support', 'Soft teal linen exterior', 'Removable washable cover']
  },
  9: {
    shortName: 'Cashmere Throw',
    longCopy:
      'Cashmere Blend Throw brings a soft, furniture-friendly layer to sofas, beds, and quiet corners. The woven surface feels elevated without being delicate, giving your pet a dedicated resting zone that still belongs in the room.',
    checks: ['Soft woven cashmere blend', 'Protects sofas and bedding', 'Warm without bulky padding', 'Easy fold and travel format']
  },
  10: {
    shortName: 'Ceramic Duo',
    longCopy:
      'Sculpted Ceramic Duo turns feeding into a calmer dining ritual. The raised form supports posture, the weighted base helps reduce sliding, and the smooth ceramic surface keeps daily cleaning simple.',
    checks: ['Raised posture-friendly profile', 'Weighted anti-slide base', 'Smooth glazed ceramic', 'Designed for food and water pairing']
  },
  11: {
    shortName: 'Rope Set',
    longCopy:
      'Organic Cotton Rope Set is crafted for soft tugging, carrying, and sensory enrichment. Each piece uses a gentle cotton handfeel with enough structure for daily play sessions and quiet chewing.',
    checks: ['Organic cotton fibers', 'Gentle tug and carry shapes', 'Supports enrichment routines', 'Soft texture for daily play']
  },
  12: {
    shortName: 'Bath Ritual',
    longCopy:
      'Botanical Bath Ritual creates a calmer grooming moment with coat-softening botanicals and a clean, soothing finish. It is designed for pets who need freshness without harsh fragrance or heavy residue.',
    checks: ['Calming botanical profile', 'Coat-softening cleanse', 'Low-residue finish', 'Made for quiet evening routines']
  }
};

const buildLiveProductDetail = (product: Product) => ({
  shortName: product.name,
  longCopy:
    product.description ??
    'This product is loaded from the live Pet Shop API and prepared for the current storefront collection.',
  checks: [
    product.stock > 0 ? `${product.stock} items available` : 'Currently out of stock',
    product.category?.name ? `Category: ${product.category.name}` : 'Live product from Pet Shop API',
    product.createdAt ? 'Synced from server catalog' : 'Premium storefront item',
    product.badge ? `Offer: ${product.badge}` : 'Ready for cart checkout'
  ]
});

const getProductDetail = (product: Product) => {
  const category = categoryDetails[product.categoryId] ?? categoryDetails[1];
  const detail = productDetails[product.id] ?? buildLiveProductDetail(product);

  return {
    ...category,
    ...detail,
    breadcrumb: `${category.breadcrumb} › ${detail.shortName}`,
    tabs: [category.tabs[0], category.tabs[1], `${category.tabs[2]}\n(${product.reviewCount})`]
  };
};

export function ProductDetailScreen({ navigation, route }: any) {
  const { addToCart, itemCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const productId = route?.params?.productId;
  const initialProduct = useMemo<Product>(() => fallbackProducts.find((item) => item.id === productId) ?? fallbackProducts[0], [productId]);
  const [product, setProduct] = useState<Product>(initialProduct);
  const [curatedProducts, setCuratedProducts] = useState<Product[]>(fallbackProducts);
  const detail = useMemo(() => getProductDetail(product), [product]);
  const curated = useMemo(() => {
    const sameCategory = curatedProducts.filter((item) => item.id !== product.id && item.categoryId === product.categoryId);
    const otherCategories = curatedProducts.filter((item) => item.id !== product.id && item.categoryId !== product.categoryId);
    return [...sameCategory, ...otherCategories].slice(0, 4);
  }, [curatedProducts, product.id, product.categoryId]);

  useEffect(() => {
    let mounted = true;
    setQuantity(1);
    setLoading(true);
    setError('');
    setProduct(initialProduct);

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
        setCuratedProducts(apiProducts.length ? apiProducts : fallbackProducts);
      } catch (loadError: any) {
        if (!mounted) {
          return;
        }

        setCuratedProducts(fallbackProducts);
        setError(loadError?.message ?? 'Unable to load live product.');
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
    }

    return () => {
      mounted = false;
    };
  }, [initialProduct, productId]);

  const addSelected = () => {
    Array.from({ length: quantity }).forEach(() => addToCart(product));
    navigation.navigate('MainTabs', { screen: 'Cart' });
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
            <Text style={styles.errorText}>Live detail unavailable. Showing local backup.</Text>
          </View>
        ) : null}
        {loading ? (
          <View style={styles.loadingBanner}>
            <Text style={styles.loadingText}>Loading live product...</Text>
          </View>
        ) : null}
        <View style={[styles.heroWrap, { backgroundColor: detail.heroColor }]}>
          <Image
            source={product.image as ImageSourcePropType}
            style={[styles.heroImage, product.id === 7 && styles.heroImageNest]}
            resizeMode={detail.heroFit as any}
          />
          {product.badge ? (
            <View style={[styles.heroBadge, product.badge === 'LOW STOCK' && styles.heroBadgeWarning]}>
              <Text style={styles.heroBadgeText}>{product.badge}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.breadcrumb}>{detail.breadcrumb}</Text>
        <Text style={styles.title}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.rating}>★ {product.rating.toFixed(1)} ({product.reviewCount} reviews)</Text>
        </View>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.sectionLabel}>{detail.optionLabel}</Text>
        <View style={styles.swatches}>
          {detail.swatches.map((color: string, index: number) => (
            <TouchableOpacity key={color} style={[styles.swatch, { backgroundColor: color }, index === 0 && styles.swatchActive]} />
          ))}
        </View>
        <View style={styles.segmented}>
          {detail.variants.map((variant: string) => (
            <TouchableOpacity key={variant} style={[styles.segment, variant === detail.activeVariant && styles.segmentActive]}>
              <Text style={[styles.segmentText, variant === detail.activeVariant && styles.segmentActiveText]}>{variant}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
            <Text style={styles.addText}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.benefits}>
          {detail.benefits.map((benefit: any) => (
            <View key={benefit.label} style={styles.benefit}>
              <Ionicons name={benefit.icon as any} size={18} color={colors.primary} />
              <Text style={styles.benefitText}>{benefit.label}</Text>
            </View>
          ))}
        </View>

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

        <Text style={styles.curatedLabel}>CURATED FOR YOU</Text>
        <Text style={styles.curatedTitle}>{detail.curatedTitle}</Text>
        {curated.map((item) => (
          <TouchableOpacity key={item.id} style={styles.curatedItem} onPress={() => navigation.push('ProductDetail', { productId: item.id })}>
            <Image source={item.image as ImageSourcePropType} style={styles.curatedImage} resizeMode="cover" />
            <Text style={styles.curatedName}>{item.name}</Text>
            <Text style={styles.curatedPrice}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
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
  sectionLabel: { color: colors.text, fontSize: 10, fontWeight: '900', marginTop: 20, marginBottom: 8 },
  swatches: { flexDirection: 'row', gap: 10 },
  swatch: { width: 30, height: 30, borderRadius: 15 },
  swatchActive: { borderWidth: 2, borderColor: colors.primary },
  segmented: { flexDirection: 'row', gap: 8, marginTop: 14 },
  segment: { flex: 1, height: 35, borderRadius: 20, backgroundColor: '#FFEADD', alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  segmentActiveText: { color: colors.white },
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
  benefits: { flexDirection: 'row', gap: 12, marginTop: 22 },
  benefit: { flex: 1, height: 58, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  benefitText: { color: colors.text, fontSize: 10, fontWeight: '900' },
  tabs: { marginTop: 42, height: 55, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line },
  tab: { flex: 1, color: colors.muted, textAlign: 'center', fontSize: 12, fontWeight: '800' },
  tabActive: { color: colors.text, borderBottomWidth: 2, borderBottomColor: colors.primary },
  longCopy: { color: colors.muted, fontSize: 14, lineHeight: 22, fontWeight: '700', marginTop: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  checkText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  curatedLabel: { color: colors.primary, fontSize: 10, fontWeight: '900', marginTop: 52 },
  curatedTitle: { color: colors.text, fontSize: 26, lineHeight: 28, fontWeight: '900', marginTop: 6, marginBottom: 18 },
  curatedItem: { marginBottom: 24 },
  curatedImage: { width: '100%', height: 214, borderRadius: 12, backgroundColor: colors.card },
  curatedName: { color: colors.text, fontSize: 14, fontWeight: '900', marginTop: 12 },
  curatedPrice: { color: colors.muted, fontSize: 12, fontWeight: '800', marginTop: 2 }
});
