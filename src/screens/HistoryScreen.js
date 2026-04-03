import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Colors, emotionColors } from '../lib/theme';

export default function HistoryScreen({ navigation }) {
  const [loops, setLoops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('loops').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(50);
    setLoops(data || []);
    setLoading(false);
  }

  function renderItem({ item }) {
    const theme = emotionColors[item.primary_emotion] || emotionColors.calm;
    const date = new Date(item.created_at);
    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: theme.accent + '44' }]}
        onPress={() => navigation.navigate('Loop', { loop: item })}
      >
        <View style={[styles.emotionDot, { backgroundColor: theme.accent }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.label }]}>{item.emotion_label}</Text>
          <Text style={styles.summary} numberOfLines={1}>{item.summary}</Text>
          <Text style={styles.date}>
            {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>your history</Text>
      </View>
      {loading
        ? <ActivityIndicator style={{ marginTop: 60 }} color={Colors.accent} />
        : <FlatList
            data={loops}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>no check-ins yet</Text>
                <Text style={styles.emptySubText}>do your first check-in to start your history</Text>
              </View>
            }
          />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: 24, paddingBottom: 12 },
  back: { color: Colors.textSecondary, fontSize: 15, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  list: { padding: 24, paddingTop: 12, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 14,
    borderWidth: 0.5, gap: 12,
  },
  emotionDot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  summary: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  date: { fontSize: 11, color: Colors.textMuted },
  arrow: { fontSize: 16, color: Colors.textMuted },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: Colors.textSecondary, marginBottom: 6 },
  emptySubText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});
