import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from './Modal';
import { useAppState } from '../context/StateContext';
import { THEME } from '../constants/theme';

interface LogVitalModalProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'weight' | 'water' | 'sleep' | 'mood' | 'soreness';
  currentValue: string | number;
}

// Soreness Level Selector Component
const SorenessLevelSelector = ({ selectedValue, onSelect }) => {
  const levels = ['LOW', 'MEDIUM', 'HIGH'];

  return (
    <View style={sorenessStyles.selectorContainer}>
      {levels.map(level => (
        <TouchableOpacity
          key={level}
          style={[
            sorenessStyles.levelButton,
            selectedValue.toUpperCase() === level && sorenessStyles.levelButtonSelected
          ]}
          onPress={() => onSelect(level)}
        >
          <Text style={[
            sorenessStyles.levelText,
            selectedValue.toUpperCase() === level && sorenessStyles.levelTextSelected
          ]}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const LogVitalModal = ({ isVisible, onClose, type, currentValue }: LogVitalModalProps) => {
  const { setState } = useAppState();
  const [newValue, setNewValue] = useState('');

  // Reset value when modal opens
  useEffect(() => {
    if (isVisible) {
      if (type === 'soreness') {
        setNewValue(String(currentValue).toUpperCase()); // Ensure consistent case for comparison
      } else {
        setNewValue('');
      }
    }
  }, [isVisible, type, currentValue]);

  const handleSave = () => {
    if (!newValue && type !== 'soreness') { // Allow soreness to be saved if initial empty but selected
      onClose();
      return;
    }
    
    setState(prevState => {
      const updatedVitals = { ...prevState.vitals };
      switch (type) {
        case 'weight':
          updatedVitals.weight = parseFloat(newValue);
          break;
        case 'water':
          updatedVitals.water = parseFloat(newValue);
          break;
        case 'sleep':
          updatedVitals.sleep = newValue;
          break;
        case 'mood':
          updatedVitals.mood = newValue;
          break;
        case 'soreness':
          updatedVitals.soreness = newValue.toUpperCase(); // Save as uppercase
          break;
      }
      return { ...prevState, vitals: updatedVitals };
    });
    onClose();
  };

  // Helper to get technical details based on type
  const getConfig = () => {
    switch (type) {
      case 'weight': return { title: 'BODY MASS', unit: 'KG', icon: 'weight-scale', keyboard: 'numeric' };
      case 'water': return { title: 'HYDRATION', unit: 'L', icon: 'glass-water', keyboard: 'numeric' };
      case 'sleep': return { title: 'SLEEP DURATION', unit: 'HRS', icon: 'bed', keyboard: 'numeric' };
      case 'mood': return { title: 'MOOD INDEX', unit: '/10', icon: 'face-smile', keyboard: 'numeric' };
      case 'soreness': return { title: 'SORENESS LEVEL', unit: '', icon: 'bandage', keyboard: 'default' };
      default: return { title: 'LOG ENTRY', unit: '', icon: 'pen', keyboard: 'default' };
    }
  };

  const config = getConfig();

  return (
    <Modal isVisible={isVisible} onClose={onClose} title={`UPDATE // ${config.title}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* 1. Context Header */}
        <View style={styles.infoRow}>
            <View style={styles.lastRecordBox}>
                <Text style={styles.label}>LAST RECORDED</Text>
                <Text style={styles.lastValue}>
                    {type === 'soreness' ? String(currentValue).toUpperCase() : currentValue} {type !== 'soreness' && <Text style={styles.lastUnit}>{config.unit}</Text>}
                </Text>
            </View>
            <View style={styles.iconBadge}>
                <FontAwesome6 name={config.icon} size={20} color={THEME.accent} />
            </View>
        </View>

        {/* 2. Input/Selector Console */}
        {type === 'soreness' ? (
          <SorenessLevelSelector selectedValue={newValue} onSelect={setNewValue} />
        ) : (
          <View style={styles.inputWrapper}>
              <TextInput
                  style={styles.input}
                  value={newValue}
                  onChangeText={setNewValue}
                  keyboardType={config.keyboard as any}
                  placeholder="0.0"
                  placeholderTextColor="#333"
                  autoFocus={true}
                  selectionColor={THEME.accent}
              />
              {config.unit ? <Text style={styles.inputUnit}>{config.unit}</Text> : null}
              
              {/* Decorative Corner Brackets */}
              <View style={[styles.bracket, { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 }]} />
              <View style={[styles.bracket, { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 }]} />
              <View style={[styles.bracket, { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 }]} />
              <View style={[styles.bracket, { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 }]} />
          </View>
        )}

        {/* 3. Action Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleSave}>
            <LinearGradient
                colors={[THEME.accent, '#1e40af']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}
            >
                <Text style={styles.saveButtonText}>UPDATE DATABASE</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
            </LinearGradient>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </Modal>
  );
};

const sorenessStyles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: THEME.inputBg,
    borderRadius: 12,
    padding: 6,
    height: 100, // Match height of TextInput
    alignItems: 'center',
    borderColor: THEME.border,
    borderWidth: 1,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: THEME.cardDark,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  levelButtonSelected: {
    backgroundColor: THEME.accent,
    borderColor: THEME.accent,
  },
  levelText: {
    color: THEME.textMain,
    fontSize: 16,
    fontWeight: '700',
  },
  levelTextSelected: {
    color: THEME.textMain, // White text on accent background
  },
});


const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 24,
  },
  
  // INFO ROW
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  lastRecordBox: {
      gap: 4,
  },
  label: {
    color: THEME.textSec,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lastValue: {
    color: THEME.textMain,
    fontSize: 18,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  lastUnit: {
      fontSize: 12,
      color: THEME.textSec,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  iconBadge: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.2)',
  },

  // INPUT WRAPPER
  inputWrapper: {
      height: 100,
      backgroundColor: THEME.inputBg,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      borderRadius: 4, // Slight rounding, mostly industrial
      flexDirection: 'row',
      borderColor: THEME.border, // Added border for consistency
      borderWidth: 1, // Added border for consistency
  },
  input: {
      color: THEME.textMain,
      fontSize: 48,
      fontWeight: '300', // Thin font for "Digital" look
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      textAlign: 'center',
      minWidth: 100,
  },
  inputUnit: {
      position: 'absolute',
      right: 20,
      color: '#333',
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 1,
  },
  
  // DECORATIVE BRACKETS
  bracket: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderColor: '#333',
  },

  // BUTTON
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: THEME.textMain,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default LogVitalModal;