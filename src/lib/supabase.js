import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ozxhlbxpxbkrwbrtiubm.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function saveCheckin(userId, checkinText, emotionKey, emotionData) {
  const { data, error } = await supabase.from('checkins').insert([{
    user_id: userId,
    raw_text: checkinText,
    primary_emotion: emotionKey,
    energy_level: emotionData.energy,
    focus_capacity: emotionData.focus,
    social_battery: emotionData.social,
    ai_response: { emotion: emotionKey, label: emotionData.label },
  }]).select().single();
  if (error) throw error;
  return data;
}

export async function saveLoop(userId, checkinId, emotionKey, emotionData) {
  const { data, error } = await supabase.from('loops').insert([{
    user_id: userId,
    checkin_id: checkinId,
    emotion_label: emotionData.label,
    summary: emotionData.summary,
    tasks: emotionData.tasks,
    spotify_mood: emotionData.spotify,
    rest_reminder: emotionData.rest,
    social_suggestion: emotionData.social,
    energy_level: emotionData.energy,
    primary_emotion: emotionKey,
  }]).select().single();
  if (error) throw error;
  return data;
}

export async function getRecentLoops(userId, limit = 20) {
  const { data } = await supabase
    .from('loops')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getCheckinCount(userId) {
  const { count } = await supabase
    .from('checkins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  return count || 0;
}

export async function getWeeklyCheckinCount(userId) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count } = await supabase
    .from('checkins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', weekAgo.toISOString());
  return count || 0;
}
