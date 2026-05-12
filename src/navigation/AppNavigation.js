import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';

// 1. Import bộ Tab từ file riêng
import TabNavigator from './TabNavigator'; 

// 2. Import các màn hình chính
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { CartScreen } from '@/screens/CartScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import CheckoutScreen from '@/screens/CheckoutScreen';
import SuccessScreen from '@/screens/SuccessScreen';
import MyOrdersScreen from '@/screens/MyOrdersScreen';
import OrderDetailScreen from '@/screens/OrderDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigation() {
  const { isLoading , isLogin , isFirstLaunch } = useAppContext();
  // const isLogin = true; // ép luôn đã đăng nhập

  // Đợi kiểm tra cờ first launch, không hiện Splash trước Onboarding.
  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        // 1. Lần đầu mở app: Onboarding trước
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : isLoading ? (
        // 2. Sau Onboarding hoặc những lần mở app sau: Splash
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : !isLogin ? (
        // 3. Luồng khi chưa đăng nhập
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {/* Có thể thêm các màn phụ như Quên mật khẩu ở đây */}
        </>
      ) : (
        // 4. Luồng khi đã vào app thành công
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          {/* <Stack.Screen name="Filter" component={FilterScreen} options={{ presentation: 'modal' }} /> */}
        </>
      )}
    </Stack.Navigator>
  );
}
