import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../constants/theme';

type Product = any;

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAdd: (product: Product) => void | Promise<void>;
}

const formatCurrency = (amount: number) => `${Math.round(amount).toLocaleString('vi-VN')} đ`;

export function ProductCard({ product, onPress, onAdd }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress(product)}>
      <View style={styles.imageWrap}>
        {product.badge ? (
          <View style={[styles.badge, product.badge === 'LOW STOCK' && styles.lowBadge]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : null}
        <Image source={product.image as ImageSourcePropType} style={styles.image} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.rating}>★ {product.rating.toFixed(1)} ({product.reviewCount})</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => onAdd(product)}>
          <Text style={styles.addText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function FeaturedProductCard({ product, onPress, onAdd }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.featured} activeOpacity={0.92} onPress={() => onPress(product)}>
      <Image source={product.image as ImageSourcePropType} style={styles.featuredImage} />
      <View style={styles.featuredCopy}>
        <Text style={styles.rating}>★ {product.rating.toFixed(1)} ({product.reviewCount})</Text>
        <Text style={styles.featuredName}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.featuredPrice}>{formatCurrency(product.price)}</Text>
      </View>
      <TouchableOpacity style={styles.roundAdd} onPress={() => onAdd(product)}>
        <Ionicons name="add" size={27} color={colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    marginBottom: 16,
    borderRadius: 28,
    backgroundColor: colors.card,
    overflow: 'hidden',
    ...shadow
  },
  imageWrap: {
    height: 207,
    backgroundColor: '#F7EEE8'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#A4F28A'
  },
  lowBadge: {
    backgroundColor: colors.danger
  },
  badgeText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '900'
  },
  cardBody: {
    padding: 16
  },
  rating: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8
  },
  name: {
    minHeight: 38,
    color: colors.text,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800'
  },
  price: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 12
  },
  addButton: {
    height: 36,
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: colors.blueButton,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addText: {
    color: '#075C7A',
    fontSize: 12,
    fontWeight: '800'
  },
  featured: {
    minHeight: 192,
    marginBottom: 16,
    paddingRight: 20,
    borderRadius: 30,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...shadow
  },
  featuredImage: {
    width: 120,
    height: 192,
    resizeMode: 'cover'
  },
  featuredCopy: {
    flex: 1,
    paddingLeft: 18,
    paddingRight: 12
  },
  featuredName: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900'
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  },
  featuredPrice: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 20
  },
  roundAdd: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
