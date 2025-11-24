import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal as RNModal, 
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';

const { width } = Dimensions.get('window');

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isVisible, onClose, title, children }: ModalProps) => {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
            {/* The Main "Glass" Panel */}
            <LinearGradient
                colors={[THEME.cardLight, THEME.cardDark]}
                style={styles.modalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {/* 1. Header Section */}
                <View style={styles.modalHeader}>
                    <View style={styles.titleWrapper}>
                        <View style={styles.statusDot} />
                        <Text style={styles.modalTitle}>{title}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={onClose} 
                        style={styles.closeButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={20} color={THEME.textMain} />
                    </TouchableOpacity>
                </View>

                {/* 2. Technical Divider Line */}
                <LinearGradient
                    colors={['transparent', THEME.border, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.separator}
                />

                {/* 3. Content Area */}
                <View style={styles.modalContent}>
                    {children}
                </View>

            </LinearGradient>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  // Dark overlay behind the modal
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)', // Deep, immersive blackout
  },
  
  // The shape of the modal
  modalContainer: {
    width: width - 40,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden', // Ensures gradient respects border radius
    borderWidth: 1,
    borderColor: THEME.border,
  },
  
  // The Background Gradient
  modalGradient: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: THEME.glassHighlight, // "Specular Highlight" effect on top edge
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: THEME.accent,
      shadowColor: THEME.accent,
      shadowOpacity: 0.8,
      shadowRadius: 4,
  },
  modalTitle: {
    color: THEME.textMain,
    fontSize: 14,
    fontWeight: '800', // Heavy weight for "System" feel
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  
  // Close Button
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // Divider
  separator: {
      height: 1,
      width: '100%',
      marginBottom: 20,
      opacity: 0.5,
  },

  // Content
  modalContent: {
    // Allows children to fill space or flex as needed
  },
});

export default Modal;