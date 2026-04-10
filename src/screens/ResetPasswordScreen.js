// ResetPasswordScreen.js
// Add to src/screens/
// User lands here after tapping the reset link in their email
// The deep link moodloop://reset-password opens this screen

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../lib/theme';
import { Button, Input } from '../components/UI';

export default function ResetPasswordScreen({ navigation }) {
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [sessionOk, setSessionOk] = useState(false);

  // When the deep link opens this screen, Supabase automatically
  // picks up the token from the URL and sets a session.
  // We just need to wait for onAuthStateChange to fire with
  // event === 'PASSWORD_RECOVERY'
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionOk(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleUpdate() {
    if (password.length < 6) {
      Alert.alert('Too short', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords do not match', 'Make sure both fields are the same.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      Alert.alert('Update failed', error.message);
      return;
    }

    setDone(true);

    // Auto-navigate to Login after 2 seconds
    setTimeout(() => navigation.replace('Login'), 2000);
  }

  // ── Success state ────────────────────────────────────────
  if (done) {
    return (
      <View style={styles.centred}>
        <View style={styles.iconRing}>
          <View style={styles.iconInner}>
            <Text style={styles.iconText}>✓</Text>
          </View>
        </View>
        <Text style={styles.doneTitle}>password updated</Text>
        <Text style={styles.doneSubtitle}>taking you to sign in...</Text>
      </View>
    );
  }

  // ── Waiting for deep link session ────────────────────────
  if (!sessionOk) {
    return (
      <View style={styles.centred}>
        <View style={styles.iconRing}>
          <View style={styles.iconInner}>
            <Text style={styles.iconText}>⊙</Text>
          </View>
        </View>
        <Text style={styles.waitTitle}>verifying your link...</Text>
        <Text style={styles.waitSubtitle}>
          if nothing happens, tap the link in your email again
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.backBtnText}>back to sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── New password form ────────────────────────────────────
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>⊙</Text>
            </View>
          </View>
          <Text style={styles.title}>set new password</Text>
          <Text style={styles.subtitle}>choose something you will remember</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="new password"
            value={password}
            onChangeText={setPassword}
            placeholder="at least 6 characters"
            secureTextEntry
            autoFocus
          />
          <Input
            label="confirm password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="type it again"
            secureTextEntry
          />

          <Button
            title="update password"
            onPress={handleUpdate}
            loading={loading}
            style={styles.btn}
          />

          <TouchableOpacity
            onPress={() => navigation.replace('Login')}
            style={styles.cancelLink}
          >
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flexGrow: 1, justifyContent: 'center', padding: 28 },
  centred:   { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', padding: 28 },

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
  iconText: { fontSize: 24, color: Colors.accent },

  header:   { alignItems: 'center', marginBottom: 36 },
  title:    { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },

  form:       { width: '100%' },
  btn:        { marginTop: 8, marginBottom: 20 },
  cancelLink: { alignItems: 'center' },
  cancelText: { color: Colors.textMuted, fontSize: 14 },

  // Done state
  doneTitle:    { fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  doneSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },

  // Wait state
  waitTitle:    { fontSize: 20, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  waitSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  backBtn: {
    paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 10, borderWidth: 0.5, borderColor: Colors.border,
  },
  backBtnText: { fontSize: 14, color: Colors.textSecondary },
});
