import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../constants/theme';

export type TabKey = 'Home' | 'Shop' | 'Favorite' | 'Cart' | 'Profile';

const tabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'Home', label: 'Home', icon: 'home-outline' },
  { key: 'Shop', label: 'Shop', icon: 'grid-outline' },
  { key: 'Favorite', label: 'Favorite', icon: 'heart-outline' },
  { key: 'Cart', label: 'Cart', icon: 'cart-outline' },
  { key: 'Profile', label: 'Profile', icon: 'person-outline' }
];

interface BottomTabsProps {
  active: TabKey;
  onPress: (tab: TabKey) => void;
  cartCount?: number;
}

export function BottomTabs({ active, onPress, cartCount = 0 }: BottomTabsProps) {
  return (
    <View style={styles.wrapper}>
      {tabs.map((tab) => {
        const focused = tab.key === active;
        return (
          <TouchableOpacity key={tab.key} style={[styles.item, focused && styles.active]} onPress={() => onPress(tab.key)}>
            <View>
              <Ionicons name={tab.icon} size={focused ? 24 : 22} color={focused ? colors.primary : '#AFA7A0'} />
              {tab.key === 'Cart' && cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, focused && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    height: 72,
    paddingHorizontal: 14,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow
  },
  item: {
    width: 64,
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: {
    backgroundColor: '#FFE6C8'
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    color: '#AFA7A0',
    fontWeight: '600'
  },
  activeLabel: {
    color: colors.primary
  },
  badge: {
    position: 'absolute',
    right: -7,
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800'
  }
});
