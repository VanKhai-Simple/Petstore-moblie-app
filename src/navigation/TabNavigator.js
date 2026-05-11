import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
<<<<<<< HEAD
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';

// Import đúng 5 màn hình ông đang có
import { HomeScreen, ShopScreen, FavoriteScreen, CartScreen } from '../screens/PlaceholderScreens';
=======
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
>>>>>>> 97c3b7925ceb785e39dad79b653d9ac3af3da391
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
<<<<<<< HEAD
        tabBarActiveTintColor: '#e18828', 
        tabBarInactiveTintColor: '#181725', 
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          // Logic chọn icon dựa trên đúng tên màn hình của ông
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="Shop" component={ShopScreen} options={{ tabBarLabel: 'Cửa hàng' }} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} options={{ tabBarLabel: 'Yêu thích' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: 'Giỏ hàng' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Tài khoản' }} />
=======
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
>>>>>>> 97c3b7925ceb785e39dad79b653d9ac3af3da391
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
<<<<<<< HEAD
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: Platform.OS === 'android' ? 75 : 90, // Tăng thêm một chút để không bị Android Studio che mất
    paddingBottom: Platform.OS === 'android' ? 12 : 30, // Đẩy toàn bộ icon và chữ lên trên
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20, // Đổ bóng cho Android
=======
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 8,
    // Đổ bóng cho TabBar
>>>>>>> 97c3b7925ceb785e39dad79b653d9ac3af3da391
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 0,
    overflow: 'visible',
  },
  tabBarItem: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
<<<<<<< HEAD
  tabLabel: {
=======
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
>>>>>>> 97c3b7925ceb785e39dad79b653d9ac3af3da391
    fontSize: 11,
    fontWeight: '600',
    marginTop: Platform.OS === 'android' ? -2 : 0,
  }
});
