import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput
} from 'react-native';
import { Colors, Typography } from '../lib/theme';

export function Card({ children, style, onPress }) {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, style }) {
  const btnStyle = [
    styles.btn,
    variant === 'primary' && styles.btnPrimary,
    variant === 'secondary' && styles.btnSecondary,
    variant === 'ghost' && styles.btnGhost,
    variant === 'danger' && styles.btnDanger,
    disabled && styles.btnDisabled,
    style,
  ];

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.accent} size="small" />
        : <Text style={[styles.btnText, variant !== 'primary' && styles.btnTextAlt]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

export function Input({ label, style, inputStyle, ...props }) {
  return (
    <View style={[styles.inputWrap, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
    </View>
  );
}

export function MetricCard({ value, label, color }) {
  return (
    <View style={styles.metricCard}>
      <Text style={[styles.metricVal, color && { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function SectionLabel({ title }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

export function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.backBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.backText}>← back</Text>
    </TouchableOpacity>
  );
}

export function Avatar({ name, size = 44 }) {
  const initial = (name || 'F')[0].toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarInitial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>{icon || '◎'}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
    </View>
  );
}

export function ProgressBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color || Colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  btn: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  btnPrimary: { backgroundColor: Colors.accent },
  btnSecondary: { backgroundColor: Colors.bgCardLight, borderWidth: 0.5, borderColor: Colors.borderLight },
  btnGhost: { borderWidth: 0.5, borderColor: Colors.borderLight },
  btnDanger: { borderWidth: 0.5, borderColor: Colors.error + '66' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: Colors.white, fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  btnTextAlt: { color: Colors.textPrimary },
  inputWrap: { marginBottom: 18 },
  inputLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  metricVal: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  metricLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginTop: 4 },
  backBtn: { marginBottom: 24, alignSelf: 'flex-start' },
  backText: { color: Colors.textSecondary, fontSize: 15 },
  avatar: { backgroundColor: Colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontWeight: '700', color: Colors.accentLight },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 32, color: Colors.textMuted, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  emptySub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', maxWidth: 260 },
  progressTrack: { height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
