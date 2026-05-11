import React from "react";
import { useAppContext } from "../context/AppContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function Favourite() {
  const { favorites, setFavorites } = useAppContext();

  const removeFavorite = (item) => {
    setFavorites(favorites.filter((p) => p.name !== item.name));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Favorites</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="heart-outline" size={60} color="#C86B2A" />
          <Text style={styles.emptyText}>
            No favorite items yet
          </Text>
          <Text style={styles.emptySub}>
            Tap the heart icon on products you love
          </Text>
        </View>
      ) : (
        favorites.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>

            <TouchableOpacity
              onPress={() => removeFavorite(item)}
              style={styles.heart}
            >
              <Ionicons name="heart" size={22} color="#C86B2A" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EFEA",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3A1F0F",
    marginBottom: 20,
    marginTop: 40,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 120,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3428",
    marginTop: 10,
  },

  emptySub: {
    fontSize: 14,
    color: "#9A8F87",
    marginTop: 6,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 18,
    padding: 10,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3428",
  },

  category: {
    fontSize: 13,
    color: "#9A8F87",
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#C86B2A",
    marginTop: 6,
  },

  heart: {
    padding: 8,
  },
});