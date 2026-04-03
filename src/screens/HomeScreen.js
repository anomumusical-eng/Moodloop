import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../lib/theme';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'good morning';
  if (h < 17) return 'good afternoon';
  return 'good evening';
}

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [recentLoop, setRecentLoop] = useState(null);
  const [checkinCount, setCheckinCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prof } = await supabase
      .from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);

    const { data: loops } = await supabase
      .from('loops').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(1);
    if (loops?.length) setRecentLoop(loops[0]);

    const { count } = await supabase
      .from('checkins').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    setCheckinCount(count || 0);
  }

  const name = profile?.full_name?.split(' ')[0] || 'friend';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileInitial}>{name[0]?.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.checkinCard} onPress={() => navigation.navigate('Checkin')}>
          <View style={styles.checkinInner}>
            <Text style={styles.checkinQuestion}>how are you feeling right now?</Text>
            <Text style={styles.checkinSub}>tap to check in and get your loop</Text>
          </View>
          <View style={styles.checkinArrow}>
            <Text style={styles.checkinArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{checkinCount}</Text>
            <Text style={styles.statLabel}>check-ins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{checkinCount >= 7 ? '🔓' : `${checkinCount}/7`}</Text>
            <Text style={styles.statLabel}>weekly insights</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{checkinCount > 0 ? '✓' : '–'}</Text>
            <Text style={styles.statLabel}>today</Text>
          </View>
        </View>

        {recentLoop && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>your last loop</Text>
            <TouchableOpacity
              style={styles.loopCard}
              onPress={() => navigation.navigate('Loop', { loop: recentLoop })}
            >
              <Text style={styles.loopEmotion}>{recentLoop.emotion_label || 'Your mood'}</Text>
              <Text style={styles.loopSummary} numberOfLines={2}>{recentLoop.summary}</Text>
              <Text style={styles.loopTime}>
                {new Date(recentLoop.created_at).toLocaleDateString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>explore</Text>
          <View style={styles.exploreRow}>
            <TouchableOpacity style={styles.exploreCard} onPress={() => navigation.navigate('History')}>
              <Text style={styles.exploreIcon}>◷</Text>
              <Text style={styles.exploreLabel}>history</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exploreCard} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.exploreIcon}>◈</Text>
              <Text style={styles.exploreLabel}>patterns</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  name: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 0.5 },
  profileBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center',
  },
  profileInitial: { fontSize: 18, fontWeight: '600', color: Colors.accentLight },
  checkinCard: {
    backgroundColor: Colors.accent,
    borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 20,
  },
  checkinInner: { flex: 1 },
  checkinQuestion: { fontSize: 17, fontWeight: '600', color: Colors.white, marginBottom: 4 },
  checkinSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  checkinArrow: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkinArrowText: { fontSize: 18, color: Colors.white },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: 12, padding: 14, alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  statVal: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  loopCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 16,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  loopEmotion: { fontSize: 16, fontWeight: '700', color: Colors.accentLight, marginBottom: 6 },
  loopSummary: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  loopTime: { fontSize: 11, color: Colors.textMuted },
  exploreRow: { flexDirection: 'row', gap: 10 },
  exploreCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 20, alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  exploreIcon: { fontSize: 24, color: Colors.accentLight, marginBottom: 8 },
  exploreLabel: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
});
