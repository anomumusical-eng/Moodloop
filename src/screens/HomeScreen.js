import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase, getProfile, getRecentLoops, getCheckinCount, getWeeklyCheckinCount } from '../lib/supabase';
import { Colors, Emotions } from '../lib/theme';
import { Avatar, Card, SectionLabel, MetricCard, ProgressBar, EmptyState } from '../components/UI';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'up late,';
  if (h < 12) return 'good morning,';
  if (h < 17) return 'good afternoon,';
  if (h < 21) return 'good evening,';
  return 'good night,';
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function HomeScreen({ navigation }) {
  const [profile,      setProfile]      = useState(null);
  const [recentLoop,   setRecentLoop]   = useState(null);
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [weekCheckins,  setWeekCheckins]  = useState(0);
  const [refreshing,   setRefreshing]   = useState(false);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [prof, loops, total, weekly] = await Promise.all([
      getProfile(user.id),
      getRecentLoops(user.id, 1),
      getCheckinCount(user.id),
      getWeeklyCheckinCount(user.id),
    ]);

    setProfile(prof);
    if (loops?.length) setRecentLoop(loops[0]);
    setTotalCheckins(total);
    setWeekCheckins(weekly);
  }

  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'friend';
  const lastEmotion = recentLoop ? (Emotions[recentLoop.primary_emotion] || Emotions.calm) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
            <Avatar name={firstName} size={46} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.checkinBtn}
          onPress={() => navigation.navigate('Checkin')}
          activeOpacity={0.85}
        >
          <View style={styles.checkinLeft}>
            <Text style={styles.checkinQ}>how are you feeling right now?</Text>
            <Text style={styles.checkinSub}>tap to check in and get your loop</Text>
          </View>
          <View style={styles.checkinArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.metricsRow}>
          <MetricCard value={totalCheckins} label="total check-ins" />
          <MetricCard value={weekCheckins} label="this week" />
          <MetricCard
            value={weekCheckins >= 7 ? '✓' : `${weekCheckins}/7`}
            label="insights"
            color={weekCheckins >= 7 ? Colors.teal : Colors.textPrimary}
          />
        </View>

        {weekCheckins < 7 && (
          <Card style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>weekly insights progress</Text>
            <Text style={styles.insightsSub}>
              {7 - weekCheckins} more check-in{7 - weekCheckins !== 1 ? 's' : ''} to unlock your emotion patterns
            </Text>
            <View style={styles.progressWrap}>
              <ProgressBar value={weekCheckins} max={7} color={Colors.accent} />
            </View>
          </Card>
        )}

        {lastEmotion && recentLoop && (
          <>
            <SectionLabel title="your last loop" />
            <Card onPress={() => navigation.navigate('Loop', { loop: recentLoop })}>
              <View style={styles.loopTop}>
                <View style={[styles.emotionDot, { backgroundColor: lastEmotion.accent }]} />
                <Text style={[styles.loopLabel, { color: lastEmotion.accentLight }]}>
                  {recentLoop.emotion_label}
                </Text>
                <Text style={styles.loopTime}>{timeAgo(recentLoop.created_at)}</Text>
              </View>
              <Text style={styles.loopSummary} numberOfLines={2}>{recentLoop.summary}</Text>
              <Text style={styles.loopTap}>tap to view full loop →</Text>
            </Card>
          </>
        )}

        <SectionLabel title="explore" />
        <View style={styles.exploreRow}>
          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreIcon}>◷</Text>
            <Text style={styles.exploreLabel}>history</Text>
            <Text style={styles.exploreSub}>{totalCheckins} entries</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreIcon}>◈</Text>
            <Text style={styles.exploreLabel}>patterns</Text>
            <Text style={styles.exploreSub}>{weekCheckins >= 7 ? 'unlocked' : 'locked'}</Text>
          </TouchableOpacity>
        </View>

        {totalCheckins === 0 && (
          <EmptyState
            icon="◎"
            title="no check-ins yet"
            subtitle="tap the button above to do your first check-in"
          />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 14, color: Colors.textSecondary, marginBottom: 2 },
  name: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 0.3 },
  checkinBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 18,
  },
  checkinLeft: { flex: 1 },
  checkinQ: { fontSize: 17, fontWeight: '600', color: Colors.white, marginBottom: 4, lineHeight: 22 },
  checkinSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  checkinArrow: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 12,
  },
  arrowText: { fontSize: 18, color: Colors.white },
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  insightsCard: { marginBottom: 24 },
  insightsTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  insightsSub: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12 },
  progressWrap: { marginTop: 4 },
  loopTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  emotionDot: { width: 8, height: 8, borderRadius: 4 },
  loopLabel: { fontSize: 14, fontWeight: '600', flex: 1 },
  loopTime: { fontSize: 11, color: Colors.textMuted },
  loopSummary: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  loopTap: { fontSize: 11, color: Colors.textMuted },
  exploreRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  exploreCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 18, alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  exploreIcon: { fontSize: 26, color: Colors.accentLight, marginBottom: 8 },
  exploreLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 3 },
  exploreSub: { fontSize: 11, color: Colors.textMuted },
});
