import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TopToast({ message, type, onHide }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (message) {
      // Trượt xuống cách đỉnh 50px
      Animated.spring(slideAnim, {
        toValue: 50,
        useNativeDriver: true,
        bounciness: 8,
      }).start();

      // Sau 2.5s thì ẩn
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View style={[
      styles.toast, 
      { transform: [{ translateY: slideAnim }], backgroundColor: type === 'success' ? '#4CAF50' : '#FF4D4D' }
    ]}>
      <Ionicons name={type === 'success' ? "checkmark-circle" : "alert-circle"} size={20} color="white" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0, left: 20, right: 20,
    zIndex: 9999,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  text: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
});