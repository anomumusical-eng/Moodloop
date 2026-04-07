import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert
} from 'react-native';
import { getCurrentUser, saveCheckin, saveLoop } from '../lib/supabase';
import { getEmotionKey } from '../lib/gemini';
import { Colors, Emotions } from '../lib/theme';
import { BackButton } from '../components/UI';

const QUICK_PICKS = [
  { label: 'feeling good today',        emoji: '◉' },
  { label: 'really tired and drained',  emoji: '◑' },
  { label: 'anxious about something',   emoji: '◈' },
  { label: 'focused and in the zone',   emoji: '◆' },
  { label: 'sad and a bit low',         emoji: '◐' },
  { label: 'excited about something',   emoji: '◎' },
  { label: 'stressed and overwhelmed',  emoji: '⊗' },
  { label: 'calm and at peace',         emoji: '○' },
];

const STAGES = {
  WRITE:     'write',
  DETECTING: 'detecting',
  SAVING:    'saving',
};

const STAGE_MESSAGES = {
  detecting: 'reading your emotions...',
  saving:    'building your loop...',
};

export default function CheckinScreen({ navigation }) {
  const [text,  setText]  = useState('');
  const [stage, setStage] = useState(STAGES.WRITE);

  async function handleSubmit() {
    const checkinText = text.trim();
    if (checkinText.length < 3) {
      Alert.alert('Tell us more', 'Write a few words about how you feel right now.');
      return;
    }

    try {
      setStage(STAGES.DETECTING);
      const user = await getCurrentUser();
      if (!user) throw new Error('Not logged in');

      const emotionKey = await getEmotionKey(checkinText);
      const emotionData = Emotions[emotionKey] || Emotions.calm;

      setStage(STAGES.SAVING);
      const checkin = await saveCheckin(user.id, checkinText, emotionKey, emotionData);
      const loop    = await saveLoop(user.id, checkin.id, emotionKey, emotionData);

      navigation.replace('Loop', { loop, emotionData });

    } catch (err) {
      Alert.alert('Something went wrong', err.message || 'Please check your connection and try again.');
      setStage(STAGES.WRITE);
    }
  }

  if (stage !== STAGES.WRITE) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>{STAGE_MESSAGES[stage]}</Text>
        <Text style={styles.loadingDots}>· · ·</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <BackButton onPress={() => navigation.goBack()} />

          <Text style={styles.title}>how are you feeling?</Text>
          <Text style={styles.subtitle}>be honest — this is just for you</Text>

          <TextInput
            style={styles.input}
            placeholder={'e.g. "I\'m exhausted and a bit anxious about tomorrow, but also kind of relieved the week is almost over..."'}
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
            autoFocus
          />

          <Text style={styles.quickLabel}>quick picks</Text>
          <View style={styles.quickGrid}>
            {QUICK_PICKS.map(({ label, emoji }) => (
              <TouchableOpacity
                key={label}
                style={[styles.quickPill, text === label && styles.quickPillActive]}
                onPress={() => setText(text === label ? '' : label)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>{emoji}</Text>
                <Text style={[styles.quickText, text === label && styles.quickTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, text.trim().length < 3 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={text.trim().length < 3}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>get my loop →</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>your check-in is private and secure</Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  loading: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  loadingText: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginTop: 8 },
  loadingDots: { fontSize: 20, color: Colors.accent, letterSpacing: 4 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5, borderColor: Colors.border,
    borderRadius: 16, padding: 16,
    color: Colors.textPrimary, fontSize: 15,
    minHeight: 150, lineHeight: 24, marginBottom: 28,
  },
  quickLabel: {
    fontSize: 11, fontWeight: '600', color: Colors.textMuted,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
  },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  quickPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 999, borderWidth: 0.5,
    borderColor: Colors.border, backgroundColor: Colors.bgCard,
  },
  quickPillActive: { backgroundColor: Colors.accentDim, borderColor: Colors.accent },
  quickEmoji: { fontSize: 12, color: Colors.textMuted },
  quickText: { fontSize: 13, color: Colors.textSecondary },
  quickTextActive: { color: Colors.accentLight, fontWeight: '500' },
  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 14,
  },
  submitBtnDisabled: { opacity: 0.35 },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  hint: { textAlign: 'center', fontSize: 12, color: Colors.textMuted },
});
