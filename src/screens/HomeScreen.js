import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

export default function HomeScreen() {
    const { favorites, setFavorites } = useAppContext();
  const products = [
    {
      name: "Stone Grey Ceramic Bowl",
      category: "Accessories",
      price: "$18.50",
      image: require("../../assets/HomeScreen3.png"),
    },
    {
      name: "Organic Cotton Tug Toy",
      category: "Toys",
      price: "$12.00",
      image: require("../../assets/HomeScreen4.png"),
    },
    {
      name: "Hand-Stitched Leather Harness",
      category: "Accessories",
      price: "$65.00",
      image: require("../../assets/HomeScreen5.png"),
    },
    {
      name: "Cloud-Nine Plush Bed",
      category: "Sleep",
      price: "$89.00",
      image: require("../../assets/HomeScreen6.png"),
    },
  ];
const toggleFavorite = (item) => {
  const exists = favorites.find((p) => p.name === item.name);

  if (exists) {
    setFavorites(favorites.filter((p) => p.name !== item.name));
  } else {
    setFavorites([...favorites, item]);
  }
};
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <MaterialCommunityIcons
              name="paw"
              size={16}
              color="#8b4d20"
            />
          </View>

          <Text style={styles.logo}>
            Tactile Sanctuary
          </Text>
        </View>

        <TouchableOpacity style={styles.bagContainer}>
          <Feather
            name="shopping-bag"
            size={20}
            color="#4d2d1d"
          />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Feather
          name="search"
          size={16}
          color="#b18b73"
          style={{ marginRight: 8 }}
        />

        <TextInput
          placeholder="Search for treats, toys, or cozy beds..."
          placeholderTextColor="#b18b73"
          style={styles.input}
        />
      </View>

      {/* BANNER */}
      <ImageBackground
        source={require("../../assets/HomeScreen1.png")}
        style={styles.banner}
        imageStyle={{ borderRadius: 30 }}
      >
        <LinearGradient
          colors={[
            "rgba(236,158,104,0.75)",
            "rgba(236,158,104,0.35)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bannerOverlay}
        />

        <View style={styles.bannerContent}>
          <View style={styles.bannerTag}>
            <Text style={styles.bannerTagText}>
              Special Offers
            </Text>
          </View>

          <Text style={styles.bannerTitle}>
            Nurture their{"\n"}
            comfort this{"\n"}
            season
          </Text>

          <TouchableOpacity>
            <LinearGradient
colors={["#E89A5C", "#C66A2B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shopButton}
            >
              <Text style={styles.shopButtonText}>
                Shop Sale
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* SECTION HEADER */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Browse by Companion
        </Text>

        <Text style={styles.viewAll}>
          View All
        </Text>
      </View>

      {/* CATEGORIES */}
      <View style={styles.categories}>
        <Category icon="paw" name="Dogs" />

        <Category icon="paw" name="Cats" />

        <Category
          icon="wind"
          name="Birds"
          type="feather"
        />

        <Category
          icon="archive"
          name="Accessories"
          type="feather"
        />
      </View>

      {/* CURATED HEADER */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Curated Selection
        </Text>

        <Text style={styles.viewAll}>
          See Everything →
        </Text>
      </View>

      {/* BIG FEATURE CARD */}
      <View style={styles.bigCard}>
        <View style={styles.bigCardContent}>
          <View style={styles.organicTag}>
            <Text style={styles.organicText}>
              ORGANIC
            </Text>
          </View>

          <Text style={styles.bigTitle}>
            Wild-Harvested{"\n"}Salmon Kibble
          </Text>

          <Text style={styles.bigDesc}>
            High-protein, grain-free nutrition
            for active breeds.
          </Text>

          <Text style={styles.bigPrice}>
            $42.00
          </Text>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addText}>
              Add to Bag
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../../assets/HomeScreen2.png")}
          style={styles.bigImage}
        />
      </View>

      {/* PRODUCT LIST */}
      {products.map((item, index) => (
        <View
          key={index}
          style={styles.card}
        >
          {/* IMAGE */}
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={styles.productImage}
            />

           <TouchableOpacity
  style={styles.heart}
  onPress={() => toggleFavorite(item)}
>
  <Ionicons
    name={
      favorites.find((p) => p.name === item.name)
        ? "heart"
        : "heart-outline"
    }
    size={20}
    color="#C86B2A"
  />
</TouchableOpacity>
          </View>

          {/* INFO */}
          <View style={styles.info}>
            <Text style={styles.title}>
              {item.name}
            </Text>

            <Text style={styles.category}>
              {item.category}
            </Text>

            <View style={styles.bottomRow}>
<Text style={styles.price}>
                {item.price}
              </Text>

              <TouchableOpacity style={styles.smallAddButton}>
                <Text style={styles.plus}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Category({ icon, name, type }) {
  return (
    <View style={styles.categoryItem}>
      <View style={styles.circle}>
        {type === "feather" ? (
          <Feather
            name={icon}
            size={22}
            color="#9b5b2e"
          />
        ) : (
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color="#9b5b2e"
          />
        )}
      </View>

      <Text style={styles.categoryText}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EFEA",
    paddingHorizontal: 20,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 18,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eddcd1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  logo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4d2d1d",
  },

  bagContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  /* SEARCH */
  searchBox: {
    backgroundColor: "#efe1d7",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    height: 46,
    alignItems: "center",
    flexDirection: "row",
  },

  input: {
    color: "#4d2d1d",
    fontSize: 13,
    flex: 1,
  },

  /* BANNER */
  banner: {
    width: "100%",
    height: 300,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 26,
  },

  bannerOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },

  bannerContent: {
    position: "absolute",
    left: 40,
    top: 40,
    width: "70%",
  },

  bannerTag: {
    alignSelf: "flex-start",
    backgroundColor: "#CFF2C9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },

  bannerTagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E6B2E",
  },

  bannerTitle: {
    fontSize: 36,
    fontWeight: "500",
    color: "#5A2D0C",
    lineHeight: 42,
    marginBottom: 20,
  },

  shopButton: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 25,
    alignSelf: "flex-start",
  },

  shopButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  /* SECTION */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3A1F0F",
  },

  viewAll: {
    color: "#d5844a",
    fontWeight: "600",
    fontSize: 12,
  },

  /* CATEGORIES */
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  categoryItem: {
    alignItems: "center",
  },

  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#ead7cc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  categoryText: {
    fontSize: 12,
    color: "#4d2d1d",
  },

  /* BIG FEATURE CARD */
  bigCard: {
    width: "100%",
    height: 350,
    borderRadius: 32,

    paddingTop: 12,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,

    marginTop: 12,
    marginBottom: 26,

    backgroundColor: "#FFFFFF",

    overflow: "hidden",

    alignSelf: "center",
    position: "relative",
  },

  bigCardContent: {
    width: "58%",
    marginTop: -5,
    paddingTop: 8,
    zIndex: 2,
  },

  organicTag: {
    backgroundColor: "#CFF2C9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: "flex-start",
  },

  organicText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E6B2E",
  },

  bigTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4A2A12",
    marginTop: 12,
    lineHeight: 32,
    letterSpacing: 0.3,
  },

  bigDesc: {
    fontSize: 14,
    color: "#5B3A20",
    marginTop: 12,
    lineHeight: 24,
  },

  bigPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4A2A12",
    marginTop: 18,
  },

  addButton: {
    backgroundColor: "#CFE5F5",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 22,

    marginTop: 28,
    alignSelf: "flex-start",
  },

  addText: {
    color: "#1F3B4D",
    fontWeight: "700",
    fontSize: 15,
  },

  bigImage: {
    width: 300,
    height: 300,
    position: "absolute",
    right: 0,
    bottom: 0,
    resizeMode: "contain",
  },

  /* PRODUCT CARDS */
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

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  info: {
    marginTop: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3428",
  },

  category: {
    fontSize: 13,
    color: "#9A8F87",
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
    fontWeight: "700",
    color: "#C86B2A",
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
    color: "#C86B2A",
    fontWeight: "bold",
  },
});