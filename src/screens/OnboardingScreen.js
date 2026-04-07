import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Colors } from '../lib/theme';
import { Button } from '../components/UI';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '◎',
    iconColor: Colors.accent,
    title: 'meet moodloop',
    body: 'The first app that reads how you feel and reshapes your entire day around your emotional state.',
    bg: Colors.accentDim,
  },
  {
    icon: '◈',
    iconColor: '#EF9F27',
    title: 'check in daily',
    body: 'Just tell us how you feel in a few words. Our AI detects your emotional state in seconds — no wearable needed.',
    bg: '#2A1A08',
  },
  {
    icon: '↻',
    iconColor: '#1D9E75',
    title: 'get your loop',
    body: 'We build a personalised plan — music, tasks, rest reminders — perfectly matched to how you feel right now.',
    bg: '#0A2018',
  },
  {
    icon: '◉',
    iconColor: Colors.accentLight,
    title: 'discover patterns',
    body: 'After a week, Moodloop reveals hidden patterns in your emotional life you never noticed before.',
    bg: Colors.accentDim,
  },
];

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  function goNext() {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      if (current < SLIDES.length - 1) {
        setCurrent(current + 1);
      } else {
        navigation.replace('Home');
        return;
      }
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  }

  const slide = SLIDES[current];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={[styles.iconWrap, { backgroundColor: slide.bg }]}>
          <Text style={[styles.icon, { color: slide.iconColor }]}>{slide.icon}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </Animated.View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
          ))}
        </View>

        <Button
          title={current < SLIDES.length - 1 ? 'next →' : "let's go →"}
          onPress={goNext}
          style={styles.btn}
        />

        {current < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.skip}>
            <Text style={styles.skipText}>skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 28, justifyContent: 'space-between', paddingTop: 80, paddingBottom: 48 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center', marginBottom: 36,
    borderWidth: 0.5, borderColor: Colors.borderLight,
  },
  icon: { fontSize: 46 },
  title: { fontSize: 30, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 18, letterSpacing: 0.3 },
  body: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 27, maxWidth: 310 },
  bottom: { gap: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { width: 22, backgroundColor: Colors.accent, borderRadius: 3 },
  btn: {},
  skip: { alignItems: 'center' },
  skipText: { color: Colors.textMuted, fontSize: 14 },
});
