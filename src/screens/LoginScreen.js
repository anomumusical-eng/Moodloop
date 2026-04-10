import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../lib/theme';
import { Button, Input } from '../components/UI';

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) Alert.alert('Login failed', error.message);
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.logo}>
          <View style={styles.logoOuter}>
            <View style={styles.logoMiddle}>
              <View style={styles.logoInner} />
            </View>
          </View>
          <Text style={styles.appName}>moodloop</Text>
        </View>

        <Text style={styles.title}>welcome back</Text>
        <Text style={styles.subtitle}>your emotions missed you</Text>

        <View style={styles.form}>
          <Input
            label="email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="password"
            value={password}
            onChangeText={setPassword}
            placeholder="your password"
            secureTextEntry
          />

          {/* Forgot password link — sits between password field and sign in button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotText}>forgot password?</Text>
          </TouchableOpacity>

          <Button title="sign in" onPress={handleLogin} loading={loading} style={styles.btn} />

          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.link}>
            <Text style={styles.linkText}>
              don't have an account?{' '}
              <Text style={styles.linkAccent}>sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  logo: { alignItems: 'center', marginBottom: 40 },
  logoOuter: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    borderWidth: 0.5, borderColor: Colors.accentGlow,
  },
  logoMiddle: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center',
  },
  logoInner: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.accent },
  appName: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 32, textAlign: 'center' },
  form: { width: '100%' },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 16, marginTop: 4 },
  forgotText: { fontSize: 13, color: Colors.accent },
  btn: { marginBottom: 20 },
  link: { alignItems: 'center' },
  linkText: { color: Colors.textSecondary, fontSize: 14 },
  linkAccent: { color: Colors.accent, fontWeight: '600' },
});
