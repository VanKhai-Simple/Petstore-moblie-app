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
      setUser(JSON.parse(savedUserData));
      setIsLogin(true);
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
    let firstLaunch = false;

    try {
      const launchedValue = await AsyncStorage.getItem('alreadyLaunched');
      firstLaunch = launchedValue !== 'true';

      setIsFirstLaunch(firstLaunch);

      if (firstLaunch) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await loadSavedSession();
    } catch (error) {
      console.log("App Init Error:", error);
      firstLaunch = false;
      setIsFirstLaunch(false);
      setIsLoading(true);
      await loadSavedSession();
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
