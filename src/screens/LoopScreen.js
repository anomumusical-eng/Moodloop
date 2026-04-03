import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Linking
} from 'react-native';
import { Colors, emotionColors } from '../lib/theme';

export default function LoopScreen({ navigation, route }) {
  const { loop, emotion } = route.params || {};
  const emotionKey = loop?.primary_emotion || 'calm';
  const theme = emotionColors[emotionKey] || emotionColors.calm;
  const tasks = loop?.tasks || [];
  const spotifyQuery = encodeURIComponent(loop?.spotify_mood || 'calm focus');

  function openSpotify() {
    const url = `https://open.spotify.com/search/${spotifyQuery}`;
    Linking.openURL(url);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backText}>← home</Text>
        </TouchableOpacity>

        <View style={styles.emotionHeader}>
          <View style={[styles.emotionBadge, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '44' }]}>
            <Text style={[styles.emotionBadgeText, { color: theme.label }]}>your current state</Text>
          </View>
          <Text style={[styles.emotionLabel, { color: theme.label }]}>
            {loop?.emotion_label || 'Your Mood'}
          </Text>
          <Text style={styles.summary}>{loop?.summary}</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: theme.label }]}>{loop?.energy_level || 5}</Text>
            <Text style={styles.metricLabel}>energy</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: theme.label }]}>{emotion?.focus_capacity || 5}</Text>
            <Text style={styles.metricLabel}>focus</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: theme.label }]}>{emotion?.social_battery || 5}</Text>
            <Text style={styles.metricLabel}>social</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>your tasks for now</Text>
          {tasks.map((task, i) => (
            <View key={i} style={[styles.taskCard, { borderColor: theme.accent + '33' }]}>
              <View style={[styles.taskDot, { backgroundColor: theme.accent }]} />
              <Text style={styles.taskText}>{task}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.spotifyBtn, { borderColor: theme.accent + '55' }]} onPress={openSpotify}>
          <Text style={styles.spotifyIcon}>♫</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.spotifyTitle, { color: theme.label }]}>mood playlist</Text>
            <Text style={styles.spotifyQuery}>{loop?.spotify_mood}</Text>
          </View>
          <Text style={[styles.spotifyArrow, { color: theme.label }]}>→</Text>
        </TouchableOpacity>

        {loop?.social_suggestion && (
          <View style={[styles.insightCard, { borderColor: theme.accent + '33' }]}>
            <Text style={styles.insightIcon}>◎</Text>
            <Text style={styles.insightText}>{loop.social_suggestion}</Text>
          </View>
        )}

        {loop?.rest_reminder && (
          <View style={[styles.insightCard, { borderColor: theme.accent + '33' }]}>
            <Text style={styles.insightIcon}>◷</Text>
            <Text style={styles.insightText}>{loop.rest_reminder}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.newCheckinBtn} onPress={() => navigation.navigate('Checkin')}>
          <Text style={styles.newCheckinText}>check in again</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  backBtn: { marginBottom: 20 },
  backText: { color: Colors.textSecondary, fontSize: 15 },
  emotionHeader: { marginBottom: 24 },
  emotionBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 999, borderWidth: 0.5, marginBottom: 12,
  },
  emotionBadgeText: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  emotionLabel: { fontSize: 30, fontWeight: '800', marginBottom: 10, letterSpacing: 0.5 },
  summary: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  metricCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: 12, padding: 14, alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  metricVal: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  metricLabel: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 12, color: Colors.textMuted,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
  },
  taskCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 0.5,
    gap: 12,
  },
  taskDot: { width: 8, height: 8, borderRadius: 4 },
  taskText: { flex: 1, fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  spotifyBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 16,
    marginBottom: 12, borderWidth: 0.5, gap: 12,
  },
  spotifyIcon: { fontSize: 22, color: Colors.tealLight },
  spotifyTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  spotifyQuery: { fontSize: 12, color: Colors.textMuted },
  spotifyArrow: { fontSize: 18 },
  insightCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 0.5, gap: 10,
  },
  insightIcon: { fontSize: 16, color: Colors.textMuted, marginTop: 1 },
  insightText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  newCheckinBtn: {
    borderWidth: 0.5, borderColor: Colors.border,
    borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 8,
  },
  newCheckinText: { color: Colors.textSecondary, fontSize: 14 },
});
