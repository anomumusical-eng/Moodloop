import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Linking, Share
} from 'react-native';
import { Colors, Emotions } from '../lib/theme';

export default function LoopScreen({ navigation, route }) {
  const { loop, emotionData: passedEmotion } = route.params || {};
  const emotionKey  = loop?.primary_emotion || 'calm';
  const theme       = Emotions[emotionKey] || Emotions.calm;
  const emotionData = passedEmotion || theme;
  const tasks       = Array.isArray(loop?.tasks) ? loop.tasks : theme.tasks;

  function openSpotify() {
    const query = encodeURIComponent(loop?.spotify_mood || theme.spotify);
    Linking.openURL(`https://open.spotify.com/search/${query}`);
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `My Moodloop today: "${loop?.emotion_label || theme.label}"\n\n"${loop?.summary || theme.summary}"\n\nDiscover your emotion operating system → moodloop.app`,
      });
    } catch (e) {}
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} activeOpacity={0.7}>
            <Text style={[styles.back, { color: theme.accentLight + 'AA' }]}>← home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} activeOpacity={0.7} style={[styles.shareBtn, { borderColor: theme.accent + '44' }]}>
            <Text style={[styles.shareText, { color: theme.accentLight }]}>share ↑</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.stateTag, { backgroundColor: theme.glow, borderColor: theme.accent + '33' }]}>
          <Text style={[styles.stateTagText, { color: theme.accentLight }]}>your current state</Text>
        </View>

        <Text style={[styles.emotionLabel, { color: theme.accentLight }]}>
          {loop?.emotion_label || theme.label}
        </Text>

        <Text style={styles.summary}>{loop?.summary || theme.summary}</Text>

        <View style={styles.metricsRow}>
          {[
            { val: loop?.energy_level || theme.energy, label: 'energy' },
            { val: emotionData?.focus_capacity || emotionData?.focus || theme.focus, label: 'focus' },
            { val: emotionData?.social_battery || emotionData?.social || theme.social, label: 'social' },
          ].map(({ val, label }) => (
            <View key={label} style={[styles.metricCard, { backgroundColor: theme.glow, borderColor: theme.accent + '22' }]}>
              <Text style={[styles.metricVal, { color: theme.accentLight }]}>{val}</Text>
              <Text style={styles.metricLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>your tasks for now</Text>
        {tasks.map((task, i) => (
          <View key={i} style={[styles.taskCard, { borderColor: theme.accent + '33', backgroundColor: theme.card }]}>
            <View style={[styles.taskNum, { backgroundColor: theme.accent }]}>
              <Text style={styles.taskNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.taskText}>{task}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.spotifyCard, { borderColor: theme.accent + '44', backgroundColor: theme.card }]}
          onPress={openSpotify}
          activeOpacity={0.8}
        >
          <View style={[styles.spotifyIcon, { backgroundColor: theme.glow }]}>
            <Text style={{ fontSize: 18, color: theme.accentLight }}>♫</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.spotifyTitle, { color: theme.accentLight }]}>mood playlist</Text>
            <Text style={styles.spotifyQuery}>{loop?.spotify_mood || theme.spotify}</Text>
          </View>
          <Text style={[styles.spotifyArrow, { color: theme.accentLight }]}>→</Text>
        </TouchableOpacity>

        {(loop?.social_suggestion || theme.social) && (
          <View style={[styles.insightCard, { borderColor: theme.accent + '22', backgroundColor: theme.card }]}>
            <Text style={[styles.insightIcon, { color: theme.accent }]}>◎</Text>
            <Text style={styles.insightText}>{loop?.social_suggestion || theme.social}</Text>
          </View>
        )}

        {(loop?.rest_reminder || theme.rest) && (
          <View style={[styles.insightCard, { borderColor: theme.accent + '22', backgroundColor: theme.card }]}>
            <Text style={[styles.insightIcon, { color: theme.accent }]}>◷</Text>
            <Text style={styles.insightText}>{loop?.rest_reminder || theme.rest}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.againBtn, { borderColor: theme.accent + '44' }]}
          onPress={() => navigation.navigate('Checkin')}
          activeOpacity={0.7}
        >
          <Text style={[styles.againText, { color: theme.accentLight }]}>check in again</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 52 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  back: { fontSize: 15 },
  shareBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 0.5 },
  shareText: { fontSize: 13, fontWeight: '500' },
  stateTag: {
    alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 999, borderWidth: 0.5, marginBottom: 14,
  },
  stateTagText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  emotionLabel: { fontSize: 36, fontWeight: '800', marginBottom: 14, letterSpacing: 0.3, lineHeight: 42 },
  summary: { fontSize: 16, color: Colors.textSecondary, lineHeight: 26, marginBottom: 28 },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  metricCard: {
    flex: 1, borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 0.5,
  },
  metricVal: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  metricLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 },
  taskCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 0.5, gap: 12,
  },
  taskNum: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  taskNumText: { fontSize: 12, fontWeight: '700', color: Colors.white },
  taskText: { flex: 1, fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  spotifyCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, padding: 16, marginTop: 6,
    marginBottom: 8, borderWidth: 0.5, gap: 12,
  },
  spotifyIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  spotifyTitle: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  spotifyQuery: { fontSize: 12, color: Colors.textMuted },
  spotifyArrow: { fontSize: 18 },
  insightCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 0.5, gap: 10,
  },
  insightIcon: { fontSize: 15, marginTop: 1 },
  insightText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  againBtn: {
    borderWidth: 0.5, borderRadius: 12,
    padding: 15, alignItems: 'center', marginTop: 12,
  },
  againText: { fontSize: 14, fontWeight: '500' },
});
