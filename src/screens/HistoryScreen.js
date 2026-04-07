import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  FlatList, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase, getRecentLoops } from '../lib/supabase';
import { Colors, Emotions } from '../lib/theme';
import { BackButton, EmptyState } from '../components/UI';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function HistoryScreen({ navigation }) {
  const [loops,   setLoops]   = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await getRecentLoops(user.id, 50);
        setLoops(data);
      }
      setLoading(false);
    }
    load();
  }, []));

  function renderItem({ item, index }) {
    const theme = Emotions[item.primary_emotion] || Emotions.calm;
    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: theme.accent + '44' }]}
        onPress={() => navigation.navigate('Loop', { loop: item })}
        activeOpacity={0.75}
      >
        <View style={[styles.dot, { backgroundColor: theme.accent }]} />
        <View style={styles.cardContent}>
          <Text style={[styles.label, { color: theme.accentLight }]}>{item.emotion_label}</Text>
          <Text style={styles.summary} numberOfLines={1}>{item.summary}</Text>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        </View>
        <Text style={[styles.arrow, { color: theme.accent }]}>→</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>your history</Text>
        <Text style={styles.count}>{loops.length} entries</Text>
      </View>

      {loading
        ? <ActivityIndicator style={{ marginTop: 60 }} color={Colors.accent} />
        : <FlatList
            data={loops}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                icon="◷"
                title="no history yet"
                subtitle="complete your first check-in to start tracking your emotional journey"
              />
            }
          />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: 24, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  count: { fontSize: 13, color: Colors.textMuted },
  list: { padding: 24, paddingTop: 12, gap: 8, paddingBottom: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14, padding: 14,
    borderWidth: 0.5, gap: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  cardContent: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  summary: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4, lineHeight: 17 },
  date: { fontSize: 11, color: Colors.textMuted },
  arrow: { fontSize: 16 },
});
