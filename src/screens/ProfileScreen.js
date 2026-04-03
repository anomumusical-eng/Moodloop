import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../lib/theme';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, thisWeek: 0 });

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);
    const { count: total } = await supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: thisWeek } = await supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', weekAgo.toISOString());
    setStats({ total: total || 0, thisWeek: thisWeek || 0 });
  }

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  }

  const name = profile?.full_name || 'Friend';
  const initial = name[0]?.toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← back</Text>
        </TouchableOpacity>

        <View style={styles.avatarRow}>
          <View style={styles.avatar}><Text style={styles.avatarInitial}>{initial}</Text></View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats.total}</Text>
            <Text style={styles.statLabel}>total check-ins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{stats.thisWeek}</Text>
            <Text style={styles.statLabel}>this week</Text>
          </View>
        </View>

        {stats.total < 7 && (
          <View style={styles.insightTeaser}>
            <Text style={styles.teaserTitle}>weekly insights locked</Text>
            <Text style={styles.teaserText}>
              Complete {7 - stats.thisWeek} more check-ins this week to unlock your personal emotion patterns.
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min((stats.thisWeek / 7) * 100, 100)}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{stats.thisWeek}/7 this week</Text>
          </View>
        )}

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingBottom: 40 },
  back: { marginBottom: 24 },
  backText: { color: Colors.textSecondary, fontSize: 15 },
  avatarRow: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarInitial: { fontSize: 32, fontWeight: '700', color: Colors.accentLight },
  name: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  email: { fontSize: 13, color: Colors.textMuted },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 16, alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  statVal: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: Colors.textMuted },
  insightTeaser: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 18,
    borderWidth: 0.5, borderColor: Colors.accentDim,
    marginBottom: 24,
  },
  teaserTitle: { fontSize: 14, fontWeight: '600', color: Colors.accentLight, marginBottom: 6 },
  teaserText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 14 },
  progressBar: {
    height: 4, backgroundColor: Colors.border,
    borderRadius: 2, marginBottom: 6, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 2 },
  progressLabel: { fontSize: 11, color: Colors.textMuted },
  signOutBtn: {
    borderWidth: 0.5, borderColor: Colors.error + '66',
    borderRadius: 12, padding: 14, alignItems: 'center',
  },
  signOutText: { color: Colors.error, fontSize: 14, fontWeight: '500' },
});
