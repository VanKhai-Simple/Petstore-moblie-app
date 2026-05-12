import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabKey = 'Home' | 'Shop' | 'Favorite' | 'Cart' | 'Profile';

const tabs = [
  { key: 'Home' as TabKey, label: 'Trang chủ', icon: 'home', family: 'material' },
  { key: 'Shop' as TabKey, label: 'Cửa hàng', icon: 'paw', family: 'fontAwesome' },
  { key: 'Favorite' as TabKey, label: 'Yêu thích', icon: 'heart-outline', family: 'ionicons' },
  { key: 'Cart' as TabKey, label: 'Giỏ hàng', icon: 'shopping-cart', family: 'material' },
  { key: 'Profile' as TabKey, label: 'Tài khoản', icon: 'person-outline', family: 'ionicons' }
];

interface BottomTabsProps {
  active: TabKey;
  onPress: (tab: TabKey) => void;
  cartCount?: number;
}

export function BottomTabs({ active, onPress, cartCount = 0 }: BottomTabsProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { height: 82 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => {
        const focused = tab.key === active;
        return (
          <TouchableOpacity key={tab.key} style={styles.item} onPress={() => onPress(tab.key)}>
            <View style={[styles.itemContainer, focused && styles.activeCircle]}>
              {tab.family === 'fontAwesome' ? (
                <FontAwesome5 name={tab.icon as any} size={22} color={focused ? '#A65215' : '#BDBDBD'} />
              ) : tab.family === 'ionicons' ? (
                <Ionicons name={tab.icon as any} size={24} color={focused ? '#A65215' : '#BDBDBD'} />
              ) : (
                <MaterialIcons name={tab.icon as any} size={24} color={focused ? '#A65215' : '#BDBDBD'} />
              )}
              {focused ? <Text style={styles.activeLabel}>{tab.label}</Text> : null}
              {tab.key === 'Cart' && cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    borderTopWidth: 0,
    overflow: 'visible'
  },
  item: {
    flex: 1,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 56,
    borderRadius: 32
  },
  activeCircle: {
    backgroundColor: '#FFF0E6',
    height: 58,
    width: 64
  },
  activeLabel: {
    color: '#A65215',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 15,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  }
});
