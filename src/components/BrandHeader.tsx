import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

interface BrandHeaderProps {
  showBack?: boolean;
  onBackPress?: () => void;
  onCartPress?: () => void;
}

export function BrandHeader({ showBack = false, onBackPress, onCartPress }: BrandHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { height: 70 + insets.top, paddingTop: insets.top }]}>
      <View style={styles.leftSide}>
        {showBack ? (
          <TouchableOpacity accessibilityLabel="Back" style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.brandRow}>
          <Image source={require('../../assets/Manapet-logo.png')} style={styles.logo} />
          <Text style={styles.title} numberOfLines={1}>
            ManaPet Shop
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity accessibilityLabel="Cart" style={styles.iconButton} onPress={onCartPress}>
          <Ionicons name="bag-handle-outline" size={23} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 10
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7EEE8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0
  },
  logo: {
    width: 34,
    height: 34,
    resizeMode: 'contain'
  },
  title: {
    flexShrink: 1,
    color: '#2F2926',
    fontSize: 18,
    fontWeight: '900'
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  iconButton: {
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
