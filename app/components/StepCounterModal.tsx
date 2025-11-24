import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Pedometer } from 'expo-sensors'; // Import Pedometer for checking availability/permissions
import { LinearGradient } from 'expo-linear-gradient';
import Modal from './Modal';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/StateContext';
import { StepTracker } from '../lib/StepTracker'; // Import StepTracker
import { StepStorage } from '../lib/StepStorage'; // Import StepStorage to get steps for manual refresh

interface StepCounterModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const StepCounterModal: React.FC<StepCounterModalProps> = ({ isVisible, onClose }) => {
  const { state, setState } = useAppState();
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const [pedometerPermissionStatus, setPedometerPermissionStatus] = useState<string | null>(null);
  const [isBackgroundTrackingActive, setIsBackgroundTrackingActive] = useState(false);

  // Function to update local states with current pedometer status
  const updatePedometerStatus = useCallback(async () => {
    const available = await Pedometer.isAvailableAsync();
    setPedometerAvailable(available);

    if (available) {
      const { status } = await Pedometer.getPermissionsAsync();
      setPedometerPermissionStatus(status);
      const isTracking = await StepTracker.isTracking();
      setIsBackgroundTrackingActive(isTracking);
    } else {
      setPedometerPermissionStatus('unavailable');
    }
  }, []);

  const handleGrantPermissions = async () => {
    await StepTracker.init(); // This will request permissions and start tracking
    updatePedometerStatus(); // Refresh status after attempting to grant permissions
  };

  const handleRefreshSteps = async () => {
    await StepTracker.reconcileSteps(); // Force a reconciliation with hardware
    const updatedSteps = await StepStorage.getTodaySteps();
    setState(prev => ({ ...prev, todaySteps: updatedSteps })); // Update global state
    updatePedometerStatus(); // Refresh status
  };

  useEffect(() => {
    if (isVisible) {
      updatePedometerStatus();
      // Set up an interval to refresh tracking status while modal is open
      const statusInterval = setInterval(updatePedometerStatus, 5000); // Refresh every 5 seconds
      return () => clearInterval(statusInterval); // Clear interval on unmount
    }
  }, [isVisible, updatePedometerStatus]);

  return (
    <Modal isVisible={isVisible} onClose={onClose} title="STEP TRACKER">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.contentWrapper}>
            <Text style={styles.sectionTitle}>TODAY'S STEPS</Text>
            <Text style={styles.stepCount}>{state.todaySteps}</Text> {/* Display steps from global state */}
            
            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Pedometer Available:</Text>
                <Text style={styles.statusValue}>{pedometerAvailable === null ? 'Checking...' : (pedometerAvailable ? 'Yes' : 'No')}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Permission Status:</Text>
                <Text style={styles.statusValue}>{pedometerPermissionStatus === null ? 'Checking...' : pedometerPermissionStatus}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Background Tracking:</Text>
                <Text style={styles.statusValue}>{isBackgroundTrackingActive ? 'Active' : 'Inactive'}</Text>
            </View>

            <Text style={styles.note}>
                Step tracking runs automatically in the background. Steps are reconciled on app foreground.
            </Text>

            {pedometerAvailable && pedometerPermissionStatus !== 'granted' && (
                <TouchableOpacity activeOpacity={0.8} onPress={handleGrantPermissions} style={styles.actionButton}>
                    <LinearGradient
                        colors={[THEME.accent, '#1e40af']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>GRANT PERMISSIONS</Text>
                    </LinearGradient>
                </TouchableOpacity>
            )}

            <TouchableOpacity activeOpacity={0.8} onPress={handleRefreshSteps} style={styles.actionButton}>
                <LinearGradient
                    colors={[THEME.cardDark, THEME.cardLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.buttonText}>REFRESH STEPS (MANUAL RECONCILE)</Text>
                </LinearGradient>
            </TouchableOpacity>

        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.closeModalButton}>
            <LinearGradient
                colors={[THEME.cardDark, THEME.cardLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
            >
                <Text style={styles.buttonText}>CLOSE</Text>
            </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 0,
    justifyContent: 'space-between',
    flex: 1, // Added flex:1 here for vertical layout
  },
  contentWrapper: {
    flex: 1, // Allow content to expand
    alignItems: 'center',
    paddingVertical: 20,
    gap: 15,
  },
  sectionTitle: {
      color: THEME.textSec,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.5,
      marginBottom: 5,
  },
  stepCount: {
      color: THEME.textMain,
      fontSize: 64,
      fontWeight: '200',
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      marginBottom: 20,
  },
  statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 5,
  },
  statusLabel: {
      color: THEME.textSec,
      fontSize: 14,
  },
  statusValue: {
      color: THEME.textMain,
      fontSize: 14,
      fontWeight: 'bold',
  },
  note: {
      color: THEME.textSec,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 10,
      fontStyle: 'italic',
      width: '80%',
  },
  buttonGroup: { // This styling is still present, but not used. It should be removed.
      marginTop: 20,
      width: '90%',
      gap: 10,
  },
  actionButton: {
      width: '100%',
      marginTop: 10, // Added margin top to separate buttons
  },
  closeModalButton: {
      width: '100%',
      marginTop: 20,
  },
  gradientButton: {
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
  buttonText: {
    color: THEME.textMain,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  buttonDisabled: { // This styling is still present, but not used. It should be removed.
      opacity: 0.5,
  }
});

export default StepCounterModal;