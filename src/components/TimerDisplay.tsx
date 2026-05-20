import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { msToHMS } from '../hooks/useOfflineTimer';
import { WATERCOLOR_THEME as theme } from '../theme';

interface Props {
  elapsedMs: number;
  isOffline: boolean;
}

export default function TimerDisplay({ elapsedMs, isOffline }: Props) {
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isOffline ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isOffline, colorAnim]);

  const color = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.textPrimary, theme.colors.primary], // Azul para Verde Água
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.timer, { color }]}>
        {msToHMS(elapsedMs)}
      </Animated.Text>
      <Text style={styles.unit}>hh : mm : ss</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 44, // Timer maior
    fontWeight: '300',
    letterSpacing: 2.5,
    fontVariant: ['tabular-nums'],
    fontFamily: theme.fonts.timer,
    lineHeight: 50,
  },
  unit: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 6,
  },
});
