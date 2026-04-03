import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../lib/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: '◎',
    title: 'meet moodloop',
    body: 'The first app that reads how you feel and reshapes your entire day around your emotional state.',
  },
  {
    icon: '⟡',
    title: 'check in daily',
    body: 'Just tell us how you feel in a few words. Our AI detects your emotional state in seconds.',
  },
  {
    icon: '↻',
    title: 'get your loop',
    body: 'We build a personalised plan — music, tasks, rest reminders — perfectly matched to how you feel right now.',
  },
  {
    icon: '◈',
    title: 'discover patterns',
    body: 'Over time, Moodloop learns you. Weekly insights reveal hidden patterns in your emotional life.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);

  function next() {
    if (current < slides.length - 1) setCurrent(current + 1);
    else navigation.replace('Home');
  }

  const slide = slides[current];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}><Text style={styles.icon}>{slide.icon}</Text></View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={next}>
        <Text style={styles.btnText}>
          {current < slides.length - 1 ? 'next →' : "let's go →"}
        </Text>
      </TouchableOpacity>

      {current < slides.length - 1 && (
        <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.skip}>
          <Text style={styles.skipText}>skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 28, justifyContent: 'space-between', paddingBottom: 48 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
  },
  icon: { fontSize: 44, color: Colors.accentLight },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 16, letterSpacing: 0.5 },
  body: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, maxWidth: 300 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { width: 20, backgroundColor: Colors.accent },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: 14, padding: 18,
    alignItems: 'center',
  },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  skip: { alignItems: 'center', marginTop: 16 },
  skipText: { color: Colors.textMuted, fontSize: 14 },
});
