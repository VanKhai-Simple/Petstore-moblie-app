import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import các màn hình tương ứng

//import {HomeScreen,FavoriteScreen } from '../screens/PlaceholderScreens';
import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { CartScreen } from '../screens/CartScreen';
import { useCart } from '../context/CartContext';

// import HomeScreen from '../screens/HomeScreen';
// import ShopScreen from '../screens/ShopScreen';
// import FavoriteScreen from '../screens/FavoriteScreen';
// import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Mình tự custom label nên ẩn cái mặc định đi
        tabBarStyle: [
          styles.tabBar,
          {
            height: 82 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8)
          }
        ],
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="home" label="Trang chủ" focused={focused} />
          )
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ProductListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="paw" label="Cửa hàng" focused={focused} isFontAwesome />
          )
        }}
      />
      <Tab.Screen 
        name="Favorite" 
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="heart-outline" label="Yêu thích" focused={focused} isIonicons />
          )
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="shopping-cart" label="Giỏ hàng" focused={focused} badge={itemCount} />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem icon="person-outline" label="Tài khoản" focused={focused} isIonicons />
          )
        }}
      />
    </Tab.Navigator>
  );
}

// Component phụ để render từng Icon cho đẹp
const TabItem = ({ icon, label, focused, isFontAwesome, isIonicons, badge }) => {
  return (
    <View style={[styles.itemContainer, focused && styles.activeCircle]}>
      {/* Render Icon dựa trên thư viện */}
      {isFontAwesome ? (
        <FontAwesome5 name={icon} size={22} color={focused ? '#A65215' : '#BDBDBD'} />
      ) : isIonicons ? (
        <Ionicons name={icon} size={24} color={focused ? '#A65215' : '#BDBDBD'} />
      ) : (
        <MaterialIcons name={icon} size={24} color={focused ? '#A65215' : '#BDBDBD'} />
      )}
      
      {/* Hiển thị Label khi được chọn */}
      {focused && <Text style={styles.activeLabel}>{label}</Text>}
      
      {/* Badge đỏ cho giỏ hàng */}
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 8,
    // Đổ bóng cho TabBar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    borderTopWidth: 0,
    overflow: 'visible',
  },
  tabBarItem: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 56,
    borderRadius: 32,
  },
  activeCircle: {
    backgroundColor: '#FFF0E6', // Màu cam nhạt vòng tròn
    height: 58,
    width: 64,
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
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});