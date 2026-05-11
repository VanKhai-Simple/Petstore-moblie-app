import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

export default function FavoriteProductCard({ item, onPress, formatCurrency }: any) {
  const { favorites, setFavorites } = useAppContext();

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không (dựa vào id hoặc name)
  const isFavorite = favorites?.find((p: any) => p.id === item.id || p.name === item.name);

  const toggleFavorite = () => {
    if (!favorites) return;
    if (isFavorite) {
      setFavorites(favorites.filter((p: any) => p.id !== item.id && p.name !== item.name));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  const displayPrice = formatCurrency ? formatCurrency(item.price) : item.price;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={item.image as ImageSourcePropType} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={colors.primary || "#C86B2A"} />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {item.category && item.category.name ? (
          <Text style={styles.category}>{item.category.name}</Text>
        ) : item.category ? (
          <Text style={styles.category}>{item.category}</Text>
        ) : null}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{displayPrice}</Text>
          <TouchableOpacity style={styles.smallAddButton}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 22,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#F8F5F2",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  info: {
    marginTop: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text || "#4A3428",
  },
  category: {
    fontSize: 13,
    color: colors.muted || "#9A8F87",
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary || "#C86B2A",
  },
  smallAddButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1E3D6",
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    fontSize: 20,
    color: colors.primary || "#C86B2A",
    fontWeight: "bold",
  },
});
