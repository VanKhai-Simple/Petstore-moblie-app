import React from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandHeader } from '../components/BrandHeader';
import { colors, shadow } from '../constants/theme';
import { useCart } from '../context/CartContext';

const shipping = 12.5;
const taxRate = 0.082;

export function CartScreen({ navigation }: any) {
  const { lines, itemCount, subtotal, removeFromCart, updateQuantity } = useCart();
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <View style={styles.root}>
      <BrandHeader showSearch={false} onCartPress={() => navigation.navigate('Cart')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headingRow}>
          <Text style={styles.title}>Your Cart</Text>
          <Text style={styles.count}>({itemCount} items)</Text>
        </View>

        {lines.map((line) => (
          <View key={line.product.id} style={styles.cartCard}>
            <Image source={line.product.image as ImageSourcePropType} style={styles.productImage} />
            <View style={styles.infoRow}>
              <View style={styles.itemCopy}>
                <Text style={styles.itemName}>{line.product.name}</Text>
                <Text style={styles.itemSize}>{line.product.size ?? 'Premium sanctuary item'}</Text>
              </View>
              <Text style={styles.itemPrice}>${(line.product.price * line.quantity).toFixed(2)}</Text>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.quantityPill}>
                <TouchableOpacity onPress={() => updateQuantity(line.product.id, line.quantity - 1)}>
                  <Ionicons name="remove" size={19} color={colors.muted} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{line.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(line.product.id, line.quantity + 1)}>
                  <Ionicons name="add" size={19} color={colors.muted} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(line.product.id)}>
                <Ionicons name="trash-outline" size={17} color={colors.muted} />
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <Row label="Standard Shipping" value={`$${shipping.toFixed(2)}`} />
          <Row label="Estimated Tax" value={`$${tax.toFixed(2)}`} />
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient colors={['#C46312', '#FF9C66']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.checkout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={22} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.note}>Free shipping applied to your sanctuary member account. Returns are always complimentary.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 108 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  title: { color: colors.text, fontSize: 31, fontWeight: '900' },
  count: { color: colors.muted, fontSize: 17, fontWeight: '800' },
  cartCard: { padding: 24, borderRadius: 30, backgroundColor: colors.card, marginBottom: 32, ...shadow },
  productImage: { width: '100%', height: 128, borderRadius: 7, resizeMode: 'cover', backgroundColor: '#F4F0ED' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 28 },
  itemCopy: { flex: 1 },
  itemName: { color: colors.text, fontSize: 20, lineHeight: 23, fontWeight: '900' },
  itemSize: { color: colors.muted, fontSize: 15, marginTop: 7 },
  itemPrice: { color: colors.text, fontSize: 20, fontWeight: '900' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  quantityPill: { width: 122, height: 40, borderRadius: 22, backgroundColor: '#FFEDE3', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  quantity: { color: colors.text, fontSize: 16, fontWeight: '900' },
  removeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  removeText: { color: colors.muted, fontSize: 15, fontWeight: '800' },
  summary: { marginTop: 16, padding: 34, borderRadius: 30, backgroundColor: colors.cardWarm, ...shadow },
  summaryTitle: { color: colors.text, fontSize: 21, fontWeight: '900', marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryLabel: { color: colors.muted, fontSize: 16 },
  summaryValue: { color: colors.text, fontSize: 16, fontWeight: '800' },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  totalLabel: { color: colors.text, fontSize: 20, fontWeight: '900' },
  totalValue: { color: colors.primary, fontSize: 27, fontWeight: '900' },
  checkout: { height: 58, borderRadius: 29, marginTop: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...shadow },
  checkoutText: { color: colors.white, fontSize: 18, fontWeight: '900' },
  note: { color: colors.muted, fontSize: 13, lineHeight: 17, textAlign: 'center', marginTop: 24 }
});
