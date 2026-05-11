import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useAppContext } from "../context/AppContext";
import {
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

export default function ProfileScreen() {

  const { logout } = useAppContext();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
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

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../../assets/ProfileScreen1.png")}
          style={styles.avatar}
        />

        {/* Edit Avatar */}
        <TouchableOpacity style={styles.editButton}>
          <Feather
            name="edit-2"
            size={14}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.name}>
          Eleanor Vance
        </Text>

        <Text style={styles.member}>
          Premium Member • Joined Sept 2023
        </Text>
      </View>

      {/* Recent Orders */}
      <View style={styles.ordersHeader}>
        <Text style={styles.ordersTitle}>
          Recent Orders
        </Text>

        <Text style={styles.viewAll}>
          View All History
        </Text>
      </View>

      {/* Order 1 */}
      <View style={styles.orderCard}>
        <View style={styles.orderTop}>
          <Text style={styles.delivered}>
            Delivered
          </Text>

          <Text style={styles.orderId}>
            #ORD-2849
          </Text>
        </View>

        <View style={styles.orderContent}>
          <Image
            source={require("../../assets/ProfileScreen2.png")}
            style={styles.productImage}
          />

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.productTitle}>
              Artisan Wool Sweater
            </Text>

            <Text style={styles.orderDate}>
              Arrived Oct 12
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>
            Buy Again
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order 2 */}
      <View style={styles.orderCard}>
        <View style={styles.orderTop}>
          <Text style={styles.transit}>
            In Transit
          </Text>

          <Text style={styles.orderId}>
#ORD-3012
          </Text>
        </View>

        <View style={styles.orderContent}>
          <Image
            source={require("../../assets/ProfileScreen3.png")}
            style={styles.productImage}
          />

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.productTitle}>
              Organic Salmon Treats
            </Text>

            <Text style={styles.orderDate}>
              Delivery by Oct 24
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.trackButton}>
          <Text style={styles.trackText}>
            Track Package
          </Text>
        </TouchableOpacity>
      </View>

      {/* SAVED ADDRESSES */}
      <View style={styles.addressCard}>
        <View style={styles.sectionRow}>
          <Feather
            name="map-pin"
            size={18}
            color="#C86B2A"
          />

          <Text style={styles.sectionTitle}>
            Saved Addresses
          </Text>
        </View>

        {/* HOME */}
        <View style={styles.addressItem}>
          <View>
            <Text style={styles.addressTag}>
              HOME
            </Text>

            <Text style={styles.addressText}>
              2482 Timberbrook Lane
            </Text>

            <Text style={styles.addressText}>
              Austin, TX 78701
            </Text>
          </View>

          <Feather
            name="more-vertical"
            size={18}
            color="#9C6B4E"
          />
        </View>

        {/* OFFICE */}
        <View style={styles.addressItem}>
          <View>
            <Text style={styles.addressTag}>
              OFFICE
            </Text>

            <Text style={styles.addressText}>
              101 Congress Ave, Suite 400
            </Text>

            <Text style={styles.addressText}>
              Austin, TX 78701
            </Text>
          </View>

          <Feather
            name="more-vertical"
            size={18}
            color="#9C6B4E"
          />
        </View>

        <TouchableOpacity style={styles.addAddress}>
          <Text style={styles.addAddressText}>
            + Add New Address
          </Text>
        </TouchableOpacity>
      </View>

      {/* PAYMENT METHODS */}
      <View style={styles.paymentCard}>
        <View style={styles.sectionRow}>
          <Feather
            name="credit-card"
            size={18}
            color="#C86B2A"
          />

          <Text style={styles.sectionTitle}>
            Payment Methods
          </Text>
        </View>

        <View style={styles.creditCard}>
          <View style={styles.cardTop}>
            {/* CONTACTLESS ICON */}
            <View style={styles.contactlessCircle}>
              <MaterialCommunityIcons
                name="contactless-payment"
                size={14}
                color="#fff"
              />
            </View>

            <View style={styles.cardChip} />
          </View>
<Text style={styles.cardNumber}>
            •••• •••• •••• 5821
          </Text>

          <View style={styles.cardRow}>
            <Text style={styles.cardName}>
              ELEANOR VANCE
            </Text>

            <Text style={styles.cardDate}>
              08/26
            </Text>
          </View>
        </View>

        {/* LINK PAYMENT */}
        <TouchableOpacity style={styles.linkPayment}>
          <View style={styles.plusCircle}>
            <Feather
              name="plus"
              size={11}
              color="#C86B2A"
            />
          </View>

          <Text style={styles.linkPaymentText}>
            Link New Payment
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACCOUNT SETTINGS */}
      <TouchableOpacity style={styles.accountBtn}>
        <Text style={styles.accountText}>
          Account Settings
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
        <Feather
          name="log-out"
          size={18}
          color="#fff"
          style={{ marginRight: 8 }}
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>
        Version 2.4.1 • Data Privacy Protected
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EFEA",
    paddingHorizontal: 20,
  },

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

  profileSection: {
    backgroundColor: "#E9DED6",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
    position: "relative",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  editButton: {
    position: "absolute",
    top: 100,
    right: 120,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#C86B2A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E9DED6",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A3428",
  },

  member: {
    fontSize: 13,
    color: "#8E6F5A",
    marginTop: 4,
  },

  ordersHeader: {
flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  ordersTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3428",
  },

  viewAll: {
    fontSize: 13,
    color: "#C86B2A",
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },

  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  delivered: {
    backgroundColor: "#BEE8C8",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
    color: "#2F7D46",
  },

  transit: {
    backgroundColor: "#F7C6A8",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
    color: "#A55222",
  },

  orderId: {
    fontSize: 12,
    color: "#8E6F5A",
  },

  orderContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },

  productTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A3428",
  },

  orderDate: {
    fontSize: 12,
    color: "#8E6F5A",
  },

  buyButton: {
    backgroundColor: "#B7D3EA",
    padding: 10,
    borderRadius: 15,
    marginTop: 15,
    alignItems: "center",
  },

  buyText: {
    color: "#1A4E72",
    fontWeight: "600",
  },

  trackButton: {
    backgroundColor: "#F1DED2",
    padding: 10,
    borderRadius: 15,
    marginTop: 15,
    alignItems: "center",
  },

  trackText: {
    color: "#7A3E1D",
    fontWeight: "600",
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3428",
  },

  addressCard: {
    backgroundColor: "#E9DED6",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  addressItem: {
    backgroundColor: "#F4EFEA",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  addressTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C86B2A",
    marginBottom: 3,
  },

  addressText: {
    fontSize: 13,
    color: "#5B4636",
  },

  addAddress: {
    marginTop: 8,
  },

  addAddressText: {
    color: "#C86B2A",
    fontWeight: "600",
  },

  paymentCard: {
    backgroundColor: "#E9DED6",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  creditCard: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  /* CONTACTLESS */
  contactlessCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  cardChip: {
    width: 34,
    height: 18,
    borderRadius: 10,
backgroundColor: "#444",
  },

  cardNumber: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 10,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardName: {
    color: "#ccc",
    fontSize: 12,
  },

  cardDate: {
    color: "#ccc",
    fontSize: 12,
  },

  linkPayment: {
    borderWidth: 1,
    borderColor: "#E0A680",
    borderStyle: "dashed",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  plusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#C86B2A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  linkPaymentText: {
    color: "#C86B2A",
    fontWeight: "600",
    fontSize: 14,
  },

  accountBtn: {
    backgroundColor: "#EAD7C9",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 15,
  },

  accountText: {
    fontWeight: "600",
    color: "#6B3E1F",
  },

  logoutBtn: {
    backgroundColor: "#F26745",
    padding: 16,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    fontSize: 11,
    color: "#9C8A7C",
    marginBottom: 30,
  },
});