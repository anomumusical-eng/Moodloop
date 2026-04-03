import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { detectEmotion } from '../lib/gemini';
import { Colors } from '../lib/theme';

const QUICK_MOODS = [
  'feeling good today', 'really tired and drained',
  'anxious about something', 'focused and ready to work',
  'sad but okay', 'excited and energetic',
  'stressed and overwhelmed', 'calm and peaceful',
];

export default function CheckinScreen({ navigation }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('write'); // write | analysing

  async function handleSubmit() {
    const checkinText = text.trim();
    if (checkinText.length < 3) {
      Alert.alert('Tell us more', 'Write a few words about how you feel.');
      return;
    }

    setLoading(true);
    setStage('analysing');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const emotion = await detectEmotion(checkinText);

      const { data: checkin } = await supabase.from('checkins').insert([{
        user_id: user.id,
        raw_text: checkinText,
        primary_emotion: emotion.primary_emotion,
        energy_level: emotion.energy_level,
        focus_capacity: emotion.focus_capacity,
        social_battery: emotion.social_battery,
        ai_response: emotion,
      }]).select().single();

      const { data: loop } = await supabase.from('loops').insert([{
        user_id: user.id,
        checkin_id: checkin.id,
        emotion_label: emotion.emotion_label,
        summary: emotion.summary,
        tasks: emotion.tasks,
        spotify_mood: emotion.spotify_mood,
        rest_reminder: emotion.rest_reminder,
        social_suggestion: emotion.social_suggestion,
        energy_level: emotion.energy_level,
        primary_emotion: emotion.primary_emotion,
      }]).select().single();

      navigation.replace('Loop', { loop, emotion });

    } catch (err) {
      Alert.alert('Something went wrong', 'Check your internet connection and try again.');
      setStage('write');
    }

    setLoading(false);
  }

  if (stage === 'analysing') {
    return (
      <View style={styles.analysing}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.analysingText}>reading your emotions...</Text>
        <Text style={styles.analysingSubText}>building your loop</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>how are you feeling?</Text>
          <Text style={styles.subtitle}>be honest — this is just for you</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 'I'm tired and a bit anxious about tomorrow, but also kind of excited...'"
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
            autoFocus
          />

          <Text style={styles.quickLabel}>quick picks</Text>
          <View style={styles.quickWrap}>
            {QUICK_MOODS.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[styles.quickPill, text === mood && styles.quickPillActive]}
                onPress={() => setText(mood)}
              >
                <Text style={[styles.quickText, text === mood && styles.quickTextActive]}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, text.length < 3 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading || text.length < 3}
          >
            <Text style={styles.submitText}>get my loop →</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 24 },
  backText: { color: Colors.textSecondary, fontSize: 15 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5, borderColor: Colors.border,
    borderRadius: 16, padding: 16,
    color: Colors.textPrimary, fontSize: 16,
    minHeight: 140, lineHeight: 24,
    marginBottom: 24,
  },
  quickLabel: { fontSize: 12, color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  quickWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  quickPill: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 0.5,
    borderColor: Colors.border, backgroundColor: Colors.bgCard,
  },
  quickPillActive: { backgroundColor: Colors.accentDim, borderColor: Colors.accent },
  quickText: { fontSize: 13, color: Colors.textSecondary },
  quickTextActive: { color: Colors.accentLight },
  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14, padding: 18, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  analysing: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16 },
  analysingText: { fontSize: 20, fontWeight: '600', color: Colors.textPrimary },
  analysingSubText: { fontSize: 14, color: Colors.textSecondary },
});
