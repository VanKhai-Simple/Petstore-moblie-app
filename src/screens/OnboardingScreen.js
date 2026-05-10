import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const DATA = [
  { 
    id: '1', 
    title: 'Chào mừng bạn!', 
    desc: 'Nơi tình yêu bắt đầu cho những người bạn bốn chân của bạn.', 
    img: require('../../assets/onboarding1.png'),
    type: 'normal'
  },
  { 
    id: '2', 
    title: 'Chăm sóc tận tâm', 
    desc: 'Tìm kiếm thức ăn, phụ kiện và dịch vụ chăm sóc sức khỏe tốt nhất.', 
    img: require('../../assets/onboarding2.png'),
    type: 'normal'
  },
  { 
    id: '3', 
    title: 'Sẵn sàng chưa?', 
    desc: 'Bắt đầu hành trình cùng người bạn mới ngay hôm nay.', 
    img: require('../../assets/onboarding3.png'),
    type: 'full' // Dùng để nhận diện màn hình thứ 3
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const { completeOnboarding } = useAppContext();

  const handleDone = async () => {
    await completeOnboarding();
  };

  const renderItem = ({ item, index }) => {
    const isFull = item.type === 'full';

    return (
      <View style={styles.slide}>
        {/* Khối màu cam xoay nhẹ phía sau (Decoration Box) */}
        {!isFull && (
          <View style={[styles.decorBox, { transform: [{ rotate: index % 2 === 0 ? '-35deg' : '35deg' }] }]} />
        )}

        <View style={isFull ? styles.fullImageContainer : styles.imageContainer}>
          <Image 
            source={item.img} 
            style={isFull ? styles.imageFull : styles.image} 
            resizeMode={isFull ? "cover" : "contain"} 
          />
          
          {/* ➕ Thêm lớp mờ này cho màn hình thứ 3 */}
          {isFull && (
            <LinearGradient
              colors={['transparent', 'rgba(255, 245, 240, 0.8)', '#FFF5F0']}
              style={styles.gradientBlur}
            />
          )}
        </View>

        {/* Phần Card nội dung phía dưới */}
        <View style={[styles.contentCard, isFull && styles.contentCardFull]}>
           {/* Indicator nằm trong Card giống hình */}
           <View style={styles.indicatorContainer}>
            {DATA.map((_, i) => {
              const dotWidth = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [8, 20, 8],
                extrapolate: 'clamp'
              });
              return <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity: currentIndex === i ? 1 : 0.3 }]} />;
            })}
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>

          <TouchableOpacity onPress={currentIndex === DATA.length - 1 ? handleDone : () => slidesRef.current.scrollToIndex({ index: currentIndex + 1 })}>
            <LinearGradient colors={['#A65215', '#F2A365']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btn}>
              <Text style={styles.btnText}>{currentIndex === DATA.length - 1 ? "Bắt đầu ngay →" : "Tiếp theo →"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Lớp phủ mờ mờ ở giữa màn hình (Background Gradient mờ) */}
      <View style={styles.blurOverlay} />
      
      <FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        ref={slidesRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F0' },
  blurOverlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(255, 245, 240, 0.5)', // Tạo cảm giác mờ mờ
  },
  slide: { width, alignItems: 'center' },
  decorBox: {
    position: 'absolute',
    top: height * 0.15,
    right: 20,
    width: width * 0.5,
    height: width * 0.6,
    backgroundColor: '#FDE1D3',
    borderRadius: 40,
    zIndex: -1, // Nằm sau ảnh
  },
  imageContainer: {
    marginTop: height * 0.1,
    width: width * 0.8,
    height: height * 0.45,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: 'white', // Nền trắng cho ảnh giống hình 1 & 2
    elevation: 10,
  },
  fullImageContainer: {
    width: width,
    height: height * 0.6,
    position: 'relative', // Quan trọng để lớp mờ bám theo container này
  },
  imageFull: { 
    width: '100%', 
    height: '100%' 
  },
  // ➕ Style cho hiệu ứng mờ chân ảnh
  gradientBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Độ cao của vùng mờ, Khải có thể chỉnh tùy ý
  },
  
  contentCard: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 25,
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    elevation: 5,
  },
  contentCardFull: {
    bottom: 40, // Đẩy card lên đè một phần vào ảnh màn 3
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#402008', textAlign: 'center' },
  desc: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 15, lineHeight: 22 },
  
  indicatorContainer: { flexDirection: 'row', marginBottom: 20 },
  dot: { height: 8, borderRadius: 4, backgroundColor: '#A65215', marginHorizontal: 3 },
  
  btn: { width: width * 0.65, paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 30 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
