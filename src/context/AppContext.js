import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    appInit();
  }, []);

  const appInit = async () => {
    try {
      // 1. Kiểm tra Onboarding (đã xem giới thiệu chưa)
      const launchedValue = await AsyncStorage.getItem('alreadyLaunched');
      setIsFirstLaunch(launchedValue === null);

      // 2. Kiểm tra Phiên đăng nhập (Token & User Data)
      const savedToken = await AsyncStorage.getItem('userToken');
      const savedUserData = await AsyncStorage.getItem('userData');

      if (savedToken && savedUserData) {
        setToken(savedToken);
        setUser(JSON.parse(savedUserData)); // Parse chuỗi string thành object
        setIsLogin(true); // Tự động đăng nhập
      }
    } catch (error) {
      console.log("App Init Error:", error);
    } finally {
      // Kết thúc loading sau 1.5s để SplashScreen biến mất
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  // Hàm đăng xuất để xóa sạch dấu vết
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
      setIsLogin(false);
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <AppContext.Provider value={{ 
      isLogin, setIsLogin, 
      user, setUser, 
      token, setToken,
      isLoading, isFirstLaunch, setIsFirstLaunch,
      logout // Export hàm logout để dùng ở màn Profile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);