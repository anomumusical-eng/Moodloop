// SignupSuccessScreen.js
// Add this file to src/screens/
// Shown automatically after a successful signup

import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated,
} from 'react-native';
import { Colors } from '../lib/theme';

export default function SignupSuccessScreen({ navigation, route }) {
  const name = route?.params?.name || '';

  // Fade + slide up animation on mount
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>

        {/* Icon */}
        <View style={styles.iconRing}>
          <View style={styles.iconInner}>
            <Text style={styles.iconText}>✓</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.title}>you're in{name ? `, ${name.split(' ')[0]}` : ''}.</Text>
        <Text style={styles.subtitle}>your account is ready</Text>

        {/* Info cards */}
        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>○</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>do a 30-second check-in</Text>
              <Text style={styles.cardDesc}>describe how you feel in your own words</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardEmoji}>◆</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>get your personal loop</Text>
              <Text style={styles.cardDesc}>tasks, music, and advice matched to your mood</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardEmoji}>◉</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>track your patterns</Text>
              <Text style={styles.cardDesc}>see how your emotions shift over time</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>go to login →</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>use the email and password you just created</Text>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Checkmark icon
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    opacity: 0.9,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accentDim || 'rgba(99,179,237,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
    color: Colors.accent,
    fontWeight: '300',
  },

  // Text
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },

  // Info cards
  cards: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
  },
  cardEmoji: {
    fontSize: 20,
    color: Colors.accent,
    width: 28,
    textAlign: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Button
  btn: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  btnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
