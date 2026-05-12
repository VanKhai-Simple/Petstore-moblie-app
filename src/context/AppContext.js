import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    appInit();
  }, []);

  const loadSavedSession = async () => {
    const savedToken = await AsyncStorage.getItem('userToken');
    const savedUserData = await AsyncStorage.getItem('userData');

    if (savedToken && savedUserData) {
      setToken(savedToken);
      setUser(JSON.parse(savedUserData)); // Parse chuỗi string thành object
      setIsLogin(true); // Tự động đăng nhập
      return;
    }

    setToken(null);
    setUser(null);
    setIsLogin(false);
  };

  const finishSplash = () => {
    setTimeout(() => setIsLoading(false), 1500);
  };

  const appInit = async () => {
    let firstLaunch = true; // mặc định là true để kiểm tra lần đầu

    try {
      // 1. Kiểm tra Onboarding (đã xem giới thiệu chưa)
      const launchedValue = await AsyncStorage.getItem('alreadyLaunched');
// firstLaunch  =
       launchedValue === null;  // tạm tắt logic kiểm tra lần đầu
      //firstLaunch = false;                     // ép app không vào onboarding

      setIsFirstLaunch(firstLaunch);

      // Lần đầu mở app: hiển thị Onboarding trước, chưa chạy Splash.
      if (firstLaunch) {
        setIsLoading(false);
        return;
      }

      // Những lần sau: Splash -> Login/Register hoặc MainTabs.
      setIsLoading(true);
      await loadSavedSession();
    } catch (error) {
      console.log("App Init Error:", error);
      firstLaunch = false;
      setIsFirstLaunch(false);
    } finally {
      if (!firstLaunch) {
        finishSplash();
      }
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('alreadyLaunched', 'true');
      setIsFirstLaunch(false);
      setIsLoading(true);
      await loadSavedSession();
    } catch (error) {
      console.log("Complete Onboarding Error:", error);
    } finally {
      finishSplash();
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
      favorites,
  setFavorites,
      isLoading, isFirstLaunch, setIsFirstLaunch,
      completeOnboarding,
      logout // Export hàm logout để dùng ở màn Profile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
