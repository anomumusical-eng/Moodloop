import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../lib/theme';
import { Button, Input } from '../components/UI';

export default function SignupScreen({ navigation }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: null,
      },
    });

    if (error) {
      Alert.alert('Signup failed', error.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      await supabase.from('profiles').upsert([{
        id: data.user.id,
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
      }]);
    }

    setLoading(false);

    // Navigate to the confirmation screen, passing the user's name
    navigation.replace('SignupSuccess', { name: name.trim() });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <View style={styles.logoOuter}>
            <View style={styles.logoMiddle}>
              <View style={styles.logoInner} />
            </View>
          </View>
          <Text style={styles.title}>join moodloop</Text>
          <Text style={styles.subtitle}>start understanding yourself</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="your name"
            value={name}
            onChangeText={setName}
            placeholder="what do people call you?"
            autoCapitalize="words"
          />
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
            placeholder="at least 6 characters"
            secureTextEntry
          />

          <Button title="create account" onPress={handleSignup} loading={loading} style={styles.btn} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
            <Text style={styles.linkText}>
              already have an account?{' '}
              <Text style={styles.linkAccent}>sign in</Text>
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
  header: { alignItems: 'center', marginBottom: 36 },
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
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  form: { width: '100%' },
  btn: { marginTop: 8, marginBottom: 20 },
  link: { alignItems: 'center' },
  linkText: { color: Colors.textSecondary, fontSize: 14 },
  linkAccent: { color: Colors.accent, fontWeight: '600' },
});
