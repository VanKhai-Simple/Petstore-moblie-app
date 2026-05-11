import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

interface BrandHeaderProps {
  showSearch?: boolean;
  onCartPress?: () => void;
}

export function BrandHeader({ showSearch = true, onCartPress }: BrandHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { height: 70 + insets.top, paddingTop: insets.top }]}>
      <View style={styles.brandRow}>
        <Image source={require('../../assets/paw_icon.png')} style={styles.logo} />
        <Text style={styles.title} numberOfLines={1}>
          ManaPet Shop
        </Text>
      </View>
      <View style={styles.actions}>
        {showSearch ? (
          <TouchableOpacity accessibilityLabel="Search" style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#746A64" />
          </TouchableOpacity>
        ) : null}
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
  brandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 10
  },
  logo: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  title: {
    flexShrink: 1,
    color: '#2F2926',
    fontSize: 21,
    fontWeight: '800'
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
