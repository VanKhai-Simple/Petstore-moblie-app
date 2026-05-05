import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  return (
    <ImageBackground 
      source={require('../../assets/splash_bg.png')} 
      style={styles.container}
    >
      <LinearGradient 
        colors={['rgba(255,245,240,0.8)', 'rgba(255,255,255,0.9)']} 
        style={styles.overlay}
      >
        <View style={styles.logoContainer}>
          <LinearGradient colors={['#A65215', '#F2A365']} style={styles.logoCircle}>
            <Image source={require('../../assets/paw_icon.png')} style={styles.pawIcon} />
          </LinearGradient>
          <Text style={styles.brandName}>PET SHOP</Text>
          <Text style={styles.slogan}>Companion for your life</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.loadingBarContainer}>
            <View style={styles.loadingBar} />
          </View>
          <Text style={styles.loadingText}>ĐANG CHUẨN BỊ KHÔNG GIAN</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  logoCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  pawIcon: { width: 60, height: 60, tintColor: 'white' },
  brandName: { color: '#402008', fontSize: 28, fontWeight: 'bold', marginTop: 15 },
  slogan: { color: '#A65215', fontSize: 16, fontStyle: 'italic' },
  footer: { position: 'absolute', bottom: 50, alignItems: 'center' },
  loadingBarContainer: { width: 150, height: 4, backgroundColor: '#EEE', borderRadius: 2, marginBottom: 10, overflow: 'hidden' },
  loadingBar: { width: '60%', height: '100%', backgroundColor: '#A65215' },
  loadingText: { color: '#A65215', fontSize: 12, letterSpacing: 2 }
});