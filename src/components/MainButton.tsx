import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { WATERCOLOR_THEME as theme } from '../theme';

interface Props {
  isOffline: boolean;
  onPress: () => void;
}

export default function MainButton({ isOffline, onPress }: Props) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isOffline) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2500, // Pulso mais lento e suave
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      pulseAnim.setValue(0);
    }
    return () => loopRef.current?.stop();
  }, [isOffline, pulseAnim]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4], // Expansão maior
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.6, 0.3, 0],
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.wrapper}>
      {/* Pulse ring (Efeito Água Espalhando) */}
      {isOffline && (
        <Animated.View
          style={[
            styles.pulseRing,
            { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
          ]}
        />
      )}

      {/* Outer decorative ring (Tom Suave) */}
      <View style={[styles.outerRing, isOffline && styles.outerRingActive]} />

      {/* Main button (Estilo Papel Branco) */}
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          isOffline && styles.buttonActive,
          pressed && styles.buttonPressed,
        ]}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
          {/* Ícone Água/Folha */}
          <Text style={[styles.icon, isOffline && styles.iconActive]}>
            {isOffline ? '💧' : '🌱'}
          </Text>
          <Text style={[styles.label, isOffline && styles.labelActive]}>
            {isOffline ? 'VOLTAR ONLINE' : 'FICAR OFFLINE'}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const SIZE = theme.sizes.mainButton;

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE + 40, // Mais espaço para o pulso
    height: SIZE + 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: SIZE + 20,
    height: SIZE + 20,
    borderRadius: (SIZE + 20) / 2,
    borderWidth: 2, // Mais espesso para parecer pincelada
    borderColor: theme.colors.activePulse,
  },
  outerRing: {
    position: 'absolute',
    width: SIZE + 20,
    height: SIZE + 20,
    borderRadius: (SIZE + 20) / 2,
    borderWidth: 1.5,
    borderColor: theme.colors.buttonBorder,
  },
  outerRingActive: {
    borderColor: theme.colors.primary,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: theme.colors.buttonBg,
    borderWidth: 1,
    borderColor: theme.colors.buttonBorder,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Sombra suave para destacar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  buttonPressed: {
    backgroundColor: theme.colors.buttonPressed,
  },
  icon: {
    fontSize: 42, // Ícone maior
    color: theme.colors.iconInactive,
  },
  iconActive: {
    color: theme.colors.iconActive,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.labelInactive,
    letterSpacing: 1.2,
    marginTop: 8,
  },
  labelActive: {
    color: theme.colors.labelActive,
  },
});
