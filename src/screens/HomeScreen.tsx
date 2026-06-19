import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  AppState,
  Linking,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AirplaneModeModal from '../components/AirplaneModeModal';

import MainButton from '../components/MainButton';
import TimerDisplay from '../components/TimerDisplay';
import StatsRow from '../components/StatsRow';
import SessionHistory from '../components/SessionHistory';
import { useOfflineTimer } from '../hooks/useOfflineTimer';
import { WATERCOLOR_THEME as theme } from '../theme';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getCurrentTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function HomeScreen() {
  const {
    isOffline,
    elapsedMs,
    totalTodayMs,
    sessionCount,
    history,
    toggle,
    invalidateSession,
  } = useOfflineTimer();

  const [clockTime, setClockTime] = useState(getCurrentTime());
  const bgAnim = useRef(new Animated.Value(0)).current;
  const [lastSession, setLastSession] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Esta referência serve como nossa "trava". Ela começa como 'false' a cada nova sessão.
  const wasOfflineRef = useRef(false);

  // Nossas duas travas de intenção de movimentação do usuário
  const isActivationPendingRef = useRef(false);
  const isDeactivationPendingRef = useRef(false);

  // Função auxiliar para abrir as configurações nativas do aparelho
  const openDeviceSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.AIRPLANE_MODE_SETTINGS');
    } else {
      Linking.openSettings();
    }
  };
  // Resetamos a trava sempre que a sessão offline for encerrada ou invalidada
  useEffect(() => {
    if (!isOffline) {
      wasOfflineRef.current = false;
    }
  }, [isOffline]);

  // 1. MONITORAMENTO EM TEMPO REAL (Com o app aberto na tela)
  useEffect(() => {
    // Se o app não estiver em modo offline, não há necessidade de monitorar
    if (!isOffline) return;

    // Escuta qualquer mudança de rede enquanto o usuário está com o app aberto
    const unsubscribe = NetInfo.addEventListener(state => {
      // Se o dispositivo se conectar à rede e a internet estiver ativa
      if (state.isConnected && state.isInternetReachable !== false) {
        invalidateSession();
        Alert.alert(
          'Sessão Cancelada 💧',
          'Detectamos que você desativou o Modo Avião ou se conectou à internet. A sessão atual foi invalidada.',
        );
      }
    });
    return () => unsubscribe();
  }, [isOffline, invalidateSession]);

  // 2. CICLO DE VIDA (A mágica do Start/Stop automático ao ir e voltar do background)
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      // Quando o app volta para o primeiro plano (Foreground)
      if (nextAppState === 'active') {
        const state = await NetInfo.fetch();
        const hasInternet =
          state.isConnected && state.isInternetReachable !== false;

        // CASO A: Usuário acabou de voltar após ativar o Modo Avião
        if (!isOffline && !hasInternet && isActivationPendingRef.current) {
          isActivationPendingRef.current = false;
          toggle(); // Dispara o cronômetro AUTOMATICAMENTE
          return;
        }

        // CASO B: Usuário voltou para o app e a internet está de volta
        if (isOffline && hasInternet) {
          if (isDeactivationPendingRef.current) {
            // FIM LEGAL: Ele usou o botão do app para ir desligar o modo avião. Sucesso!
            isDeactivationPendingRef.current = false;
            toggle(); // Salva a sessão e computa os minutos normalmente
          } else {
            // BURLA: O app voltou pro primeiro plano com internet, mas ele não usou o fluxo do botão
            invalidateSession();
            Alert.alert(
              'Sessão Cancelada 💧',
              'Detectamos que o Modo Avião foi desativado em segundo plano de forma irregular.',
            );
          }
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [isOffline, toggle, invalidateSession]);

  // 3. CONTROLE EXCLUSIVO DO BOTÃO FIKIOFF (Apenas Redirecionamento)
  const handleMainButtonPress = () => {
    if (!isOffline) {
      // Se está online, avisa o app que estamos indo ATIVAR o modo avião e abre o modal/configurações
      isActivationPendingRef.current = true;
      setModalVisible(true);
    } else {
      // Se já está na sessão, avisa o app que estamos saindo para DESATIVAR o modo avião legalmente
      isDeactivationPendingRef.current = true;
      openDeviceSettings();
    }
  };
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
          <Text style={styles.appSubtitle}>
            {isOffline ? 'Modo Avião' : 'Online'}
          </Text>
        </View>

        {/* ── Circle Area ── */}
        <View style={styles.circleArea}>
          <MainButton isOffline={isOffline} onPress={handleMainButtonPress} />

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
        <AirplaneModeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          // Sobrescrevemos o comportamento interno do modal para marcar a flag antes de abrir as configs
          onOpenSettings={() => {
            setModalVisible(false);
            openDeviceSettings();
          }}
        />
      </SafeAreaView>
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
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 13,
  },
  bar: {
    width: 3,
    backgroundColor: theme.colors.textSecondary,
    borderRadius: 1,
  },
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
