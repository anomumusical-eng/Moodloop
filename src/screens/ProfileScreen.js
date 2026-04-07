import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase, getProfile, getCheckinCount, getWeeklyCheckinCount, getRecentLoops } from '../lib/supabase';
import { Colors, Emotions } from '../lib/theme';
import { Avatar, BackButton, Card, SectionLabel, ProgressBar, Button } from '../components/UI';

export default function ProfileScreen({ navigation }) {
  const [profile,  setProfile]  = useState(null);
  const [total,    setTotal]    = useState(0);
  const [weekly,   setWeekly]   = useState(0);
  const [loops,    setLoops]    = useState([]);

  useFocusEffect(useCallback(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [prof, t, w, l] = await Promise.all([
        getProfile(user.id),
        getCheckinCount(user.id),
        getWeeklyCheckinCount(user.id),
        getRecentLoops(user.id, 20),
      ]);
      setProfile(prof);
      setTotal(t);
      setWeekly(w);
      setLoops(l);
    }
    load();
  }, []));

  function getTopEmotions() {
    if (!loops.length) return [];
    const counts = {};
    loops.forEach(l => {
      counts[l.primary_emotion] = (counts[l.primary_emotion] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count]) => ({ key, count, pct: Math.round((count / loops.length) * 100) }));
  }

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  }

  const name = profile?.full_name || 'Friend';
  const topEmotions = getTopEmotions();
  const insightsUnlocked = weekly >= 7;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <BackButton onPress={() => navigation.goBack()} />

        <View style={styles.avatarSection}>
          <Avatar name={name} size={80} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{total}</Text>
            <Text style={styles.statLabel}>total check-ins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{weekly}</Text>
            <Text style={styles.statLabel}>this week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statVal, { color: insightsUnlocked ? Colors.teal : Colors.textPrimary }]}>
              {insightsUnlocked ? '✓' : `${weekly}/7`}
            </Text>
            <Text style={styles.statLabel}>insights</Text>
          </View>
        </View>

        {!insightsUnlocked && (
          <Card>
            <Text style={styles.insightsTitle}>weekly insights — locked</Text>
            <Text style={styles.insightsSub}>
              {7 - weekly} more check-in{7 - weekly !== 1 ? 's' : ''} needed this week to unlock your personal emotion patterns
            </Text>
            <ProgressBar value={weekly} max={7} color={Colors.accent} />
            <Text style={styles.insightsPct}>{weekly}/7 this week</Text>
          </Card>
        )}

        {insightsUnlocked && topEmotions.length > 0 && (
          <>
            <SectionLabel title="your top emotions this week" />
            {topEmotions.map(({ key, count, pct }) => {
              const theme = Emotions[key] || Emotions.calm;
              return (
                <Card key={key} style={styles.emotionCard}>
                  <View style={styles.emotionRow}>
                    <View style={[styles.emotionDot, { backgroundColor: theme.accent }]} />
                    <Text style={[styles.emotionName, { color: theme.accentLight }]}>{theme.label}</Text>
                    <Text style={styles.emotionCount}>{count}x · {pct}%</Text>
                  </View>
                  <View style={styles.emotionBar}>
                    <ProgressBar value={pct} max={100} color={theme.accent} />
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {total >= 14 && topEmotions.length > 0 && (
          <>
            <SectionLabel title="your emotional insight" />
            <Card style={styles.insightBig}>
              <Text style={styles.insightBigText}>
                Your most common emotional state is{' '}
                <Text style={{ color: Colors.accentLight, fontWeight: '600' }}>
                  {Emotions[topEmotions[0]?.key]?.label || 'Calm'}
                </Text>
                {'. '}
                {total >= 21
                  ? "You've built a consistent check-in habit. Your self-awareness is genuinely growing."
                  : "Keep checking in daily to reveal deeper patterns in your emotional life."
                }
              </Text>
            </Card>
          </>
        )}

        <View style={styles.signOutWrap}>
          <Button title="sign out" variant="danger" onPress={handleSignOut} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  avatarSection: { alignItems: 'center', marginBottom: 28, marginTop: 8 },
  name: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginTop: 14, marginBottom: 4 },
  email: { fontSize: 13, color: Colors.textMuted },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  statVal: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'center' },
  insightsTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  insightsSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 14 },
  insightsPct: { fontSize: 12, color: Colors.textMuted, marginTop: 8 },
  emotionCard: { marginBottom: 8 },
  emotionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  emotionDot: { width: 10, height: 10, borderRadius: 5 },
  emotionName: { flex: 1, fontSize: 14, fontWeight: '600' },
  emotionCount: { fontSize: 12, color: Colors.textMuted },
  emotionBar: {},
  insightBig: {},
  insightBigText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  signOutWrap: { marginTop: 24 },
});
