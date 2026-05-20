import React, { useEffect, useRef, useState } from 'react';
import AirplaneModeModal from '../components/AirplaneModeModal';
import {
  Animated,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MainButton from '../components/MainButton';
import TimerDisplay from '../components/TimerDisplay';
import StatsRow from '../components/StatsRow';
import SessionHistory from '../components/SessionHistory';
import { useOfflineTimer } from '../hooks/useOfflineTimer';
import { WATERCOLOR_THEME as theme } from '../theme';

// ─── Airplane Mode (Android only via native module) ───────────────────────────
// To actually toggle airplane mode on Android you need a native module.
// See README for setup. On iOS, redirect user to Settings.
//
// Example (uncomment after setting up the native module):
// import AirplaneMode from 'react-native-airplane-mode-control';
//
// async function setAirplaneMode(enable: boolean) {
//   if (Platform.OS === 'android') {
//     await AirplaneMode.setAirplaneMode(enable);
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getCurrentTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function HomeScreen() {
  const { isOffline, elapsedMs, totalTodayMs, sessionCount, history, toggle } =
    useOfflineTimer();

  const [clockTime, setClockTime] = useState(getCurrentTime());
  const bgAnim = useRef(new Animated.Value(0)).current;
  const [lastSession, setLastSession] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setClockTime(getCurrentTime()), 10000);
    return () => clearInterval(id);
  }, []);

  // Background color transition
  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: isOffline ? 1 : 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [isOffline, bgAnim]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.background, '#E0F2F1'],
  });

  function handleToggle() {
    const session = toggle();
    // Se isOffline era false, agora ficou true (começou uma sessão)
    if (!isOffline) {
      setModalVisible(true);
    }
    if (session) {
      setLastSession(session.duration);
    } else {
      setLastSession(null);
    }
  }

  const statusText = isOffline
    ? '● Offline ativo — desconectando...'
    : lastSession
    ? `Sessão encerrada! Você ficou ${lastSession} offline.`
    : 'Toque para ativar o modo offline\ne começar a contar o tempo';

  return (
    <Animated.View style={[styles.root, { backgroundColor }]}>
      <SafeAreaView style={styles.safe}>

        {/* ── Status Bar ── */}
        <View style={styles.statusBar}>
          <Text style={styles.statusTime}>{clockTime}</Text>
          <View style={styles.statusIcons}>
            {isOffline ? (
              <Text style={styles.airplaneIcon}>💧</Text>
            ) : (
              <View style={styles.signalBars}>
                {[4, 7, 10, 13].map((h, i) => (
                  <View key={i} style={[styles.bar, { height: h }]} />
                ))}
              </View>
            )}
            <Text style={styles.batteryIcon}>▮</Text>
          </View>
        </View>

        {/* ── App Header ── */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Minuto Offline</Text>
          <Text style={styles.appSubtitle}>{isOffline ? 'Modo Avião' : 'Online'}</Text>
        </View>

        {/* ── Circle Area ── */}
        <View style={styles.circleArea}>
          <MainButton isOffline={isOffline} onPress={handleToggle} />

          <TimerDisplay elapsedMs={elapsedMs} isOffline={isOffline} />

          <Text style={[styles.statusMsg, isOffline && styles.statusMsgActive]}>
            {statusText}
          </Text>
        </View>

        {/* ── Stats ── */}
        <StatsRow
          elapsedMs={elapsedMs}
          totalTodayMs={totalTodayMs}
          sessionCount={sessionCount}
          isOffline={isOffline}
        />

        {/* ── History ── */}
        <SessionHistory history={history} />

      </SafeAreaView>
      <AirplaneModeModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20, paddingBottom: 24 }, // Padding mais suave

  // Status bar
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 8,
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  statusIcons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signalBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 13 },
  bar: { width: 3, backgroundColor: theme.colors.textSecondary, borderRadius: 1 },
  airplaneIcon: { fontSize: 14, color: theme.colors.primary },
  batteryIcon: { fontSize: 14, color: theme.colors.textSecondary },

  // Header
  header: { alignItems: 'center', marginBottom: 12 },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: 0.8,
  },
  appSubtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Circle area
  circleArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  // Status message
  statusMsg: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  statusMsgActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
