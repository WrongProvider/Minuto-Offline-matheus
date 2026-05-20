import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AirplaneModeModal({ visible, onClose }: Props) {
  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.AIRPLANE_MODE_SETTINGS');
    } else {
      Linking.openSettings();
    }
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Modo Foco Ativado</Text>
          <Text style={styles.message}>
            Para completar sua desconexão, ative o Modo Avião nas configurações do seu dispositivo.
          </Text>
          
          <TouchableOpacity style={styles.button} onPress={openSettings}>
            <Text style={styles.buttonText}>Abrir Configurações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Agora não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  container: { backgroundColor: '#181820', padding: 24, borderRadius: 16, alignItems: 'center' },
  title: { color: '#4caf50', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  message: { color: '#ccc', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  button: { backgroundColor: '#4caf50', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  cancel: { marginTop: 15 },
  cancelText: { color: '#555' }
});
