import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Session } from '../hooks/useOfflineTimer';
import { WATERCOLOR_THEME as theme } from '../theme';

interface Props {
  history: Session[];
}

export default function SessionHistory({ history }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HISTÓRICO DE DOAÇÕES</Text>

      {history.length === 0 ? (
        <View style={styles.item}>
          <Text style={[styles.itemLabel, { color: theme.colors.textSecondary }]}>Nenhuma sessão ainda</Text>
          <Text style={[styles.itemTime, { color: theme.colors.textSecondary }]}>—</Text>
        </View>
      ) : (
        history.map((session, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemLabel}>Doação às {session.startLabel}</Text>
            <Text style={styles.itemTime}>{session.duration}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    gap: 6,
  },
  title: {
    fontSize: 10,
    color: theme.colors.textPrimary,
    letterSpacing: 1.2,
    marginBottom: 8,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.buttonBg, // Branco Papel
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.buttonBorder,
    elevation: 1,
  },
  itemLabel: {
    fontSize: 11,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  itemTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.timer,
  },
});
