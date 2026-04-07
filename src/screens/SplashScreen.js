import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../lib/theme';

export default function SplashScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale  = useRef(new Animated.Value(0.85)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Login'), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <View style={styles.logoOuter}>
          <View style={styles.logoMiddle}>
            <View style={styles.logoInner} />
          </View>
        </View>
        <Text style={styles.name}>moodloop</Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          your emotion operating system
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center' },
  logoOuter: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    borderWidth: 0.5, borderColor: Colors.accentGlow,
  },
  logoMiddle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  logoInner: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  name: { fontSize: 34, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 3, marginBottom: 8 },
  tagline: { fontSize: 13, color: Colors.textMuted, letterSpacing: 1.5 },
});
