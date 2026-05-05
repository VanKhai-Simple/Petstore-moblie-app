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

import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigation() {
  const { isLoading, isLogin, isFirstLaunch } = useAppContext();

  // 1. Nếu đang load từ AsyncStorage thì hiện Splash
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        // 2. Luồng cho người mới tải app
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
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
          <Stack.Screen name="Profile" component={ProfileScreen} />
          
          {/* <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} options={{ presentation: 'modal' }} /> */}
        </>
      )}
    </Stack.Navigator>
  );
}