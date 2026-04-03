import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../lib/theme';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) { Alert.alert('Missing info', 'Please fill in all fields.'); return; }
    if (password.length < 6) { Alert.alert('Weak password', 'Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } }
    });
    if (error) { Alert.alert('Signup failed', error.message); }
    else {
      await supabase.from('profiles').insert([{
        id: data.user.id,
        full_name: name.trim(),
        email: email.trim(),
      }]);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoCircle}><Text style={styles.logoIcon}>◎</Text></View>
          <Text style={styles.title}>join moodloop</Text>
          <Text style={styles.subtitle}>start understanding yourself</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>your name</Text>
          <TextInput
            style={styles.input}
            placeholder="what do people call you?"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>password</Text>
          <TextInput
            style={styles.input}
            placeholder="at least 6 characters"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.btnText}>create account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>already have an account? <Text style={styles.linkAccent}>sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoIcon: { fontSize: 28, color: Colors.accentLight },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 1 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  form: { width: '100%' },
  label: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, letterSpacing: 1 },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5, borderColor: Colors.border,
    borderRadius: 12, padding: 14,
    color: Colors.textPrimary, fontSize: 15,
    marginBottom: 18,
  },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 4, marginBottom: 20,
  },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  linkBtn: { alignItems: 'center' },
  linkText: { color: Colors.textSecondary, fontSize: 14 },
  linkAccent: { color: Colors.accent, fontWeight: '600' },
});
