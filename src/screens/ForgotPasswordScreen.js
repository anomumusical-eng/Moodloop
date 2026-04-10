// ForgotPasswordScreen.js
// Add to src/screens/
// Accessible from LoginScreen via "forgot password?" link

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  Alert, Animated,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../lib/theme';
import { Button, Input } from '../components/UI';

export default function ForgotPasswordScreen({ navigation }) {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert('Enter your email', 'Type the email address you signed up with.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        // Deep link — opens ResetPassword screen inside the app
        redirectTo: 'moodloop://reset-password',
      }
    );

    setLoading(false);

    if (error) {
      Alert.alert('Something went wrong', error.message);
      return;
    }

    // Show success state regardless — prevents email enumeration
    setSent(true);
  }

  // ── Sent state ──────────────────────────────────────────
  if (sent) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.sentContainer}>

          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>✉</Text>
            </View>
          </View>

          <Text style={styles.sentTitle}>check your inbox</Text>
          <Text style={styles.sentSubtitle}>
            we sent a password reset link to
          </Text>
          <Text style={styles.sentEmail}>{email.trim().toLowerCase()}</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoRow}>◆  tap the link in the email</Text>
            <Text style={styles.infoRow}>◆  it opens moodloop directly</Text>
            <Text style={styles.infoRow}>◆  set your new password</Text>
            <Text style={styles.infoRow}>◆  link expires in 1 hour</Text>
          </View>

          <Text style={styles.spamNote}>
            don't see it? check your spam folder
          </Text>

          <TouchableOpacity
            style={styles.resendBtn}
            onPress={() => { setSent(false); }}
          >
            <Text style={styles.resendText}>try a different email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.loginLinkText}>
              back to <Text style={styles.loginLinkAccent}>sign in</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Input state ──────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>⊙</Text>
            </View>
          </View>
          <Text style={styles.title}>forgot password?</Text>
          <Text style={styles.subtitle}>
            no worries — we'll send a reset link to your email
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="your email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoFocus
          />

          <Button
            title="send reset link"
            onPress={handleReset}
            loading={loading}
            style={styles.btn}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>
              ← back to <Text style={styles.backLinkAccent}>sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  scroll:     { flexGrow: 1, justifyContent: 'center', padding: 28 },

  // Header
  header:     { alignItems: 'center', marginBottom: 36 },
  iconRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 0.5, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  iconInner: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText:   { fontSize: 24, color: Colors.accent },
  title:      { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  subtitle:   { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  // Form
  form:       { width: '100%' },
  btn:        { marginTop: 8, marginBottom: 20 },
  backLink:   { alignItems: 'center' },
  backLinkText:   { color: Colors.textSecondary, fontSize: 14 },
  backLinkAccent: { color: Colors.accent, fontWeight: '600' },

  // Sent state
  sentContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 28, paddingVertical: 40,
  },
  sentTitle:    { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10, textAlign: 'center' },
  sentSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  sentEmail:    { fontSize: 15, fontWeight: '600', color: Colors.accent, marginTop: 4, marginBottom: 28, textAlign: 'center' },

  infoCard: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5, borderColor: Colors.border,
    borderRadius: 14, padding: 20, gap: 12, marginBottom: 20,
  },
  infoRow:    { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  spamNote:   { fontSize: 12, color: Colors.textMuted, marginBottom: 24, textAlign: 'center' },

  resendBtn: {
    paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 10, borderWidth: 0.5, borderColor: Colors.border,
    marginBottom: 16,
  },
  resendText: { fontSize: 14, color: Colors.textSecondary },

  loginLink:      { alignItems: 'center' },
  loginLinkText:  { color: Colors.textSecondary, fontSize: 14 },
  loginLinkAccent:{ color: Colors.accent, fontWeight: '600' },
});
