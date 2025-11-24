import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal';
import { useAppState, FoodItem, MealType } from '../context/StateContext';

// THEME: "OBSIDIAN ELITE"
const THEME = {
    bg: '#000000',
    card: '#0A0A0A',
    cardBorder: '#1F1F1F',
    accent: '#3B82F6',       
    textMain: '#FFFFFF',
    textSec: '#888888',
    inputBg: '#111',
    success: '#10B981',
    danger: '#EF4444',
};

interface LogMealModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LogMealModal = ({ isVisible, onClose }: LogMealModalProps) => {
  const { setState } = useAppState();
  const [selectedMealType, setSelectedMealType] = useState<MealType>('BREAKFAST');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');

  useEffect(() => {
    if (isVisible) {
      setSelectedMealType('BREAKFAST');
      setFoodItems([]);
      setFoodName('');
      setFoodCalories('');
    }
  }, [isVisible]);

  const addFoodItem = () => {
    if (foodName.trim() === '' || foodCalories.trim() === '' || isNaN(parseFloat(foodCalories))) {
      return;
    }
    const newFoodItem: FoodItem = {
      id: uuidv4(),
      name: foodName.trim(),
      calories: parseFloat(foodCalories),
    };
    setFoodItems([...foodItems, newFoodItem]);
    setFoodName('');
    setFoodCalories('');
  };

  const removeFoodItem = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const calculateCurrentMealTotal = () => {
    return foodItems.reduce((sum, item) => sum + item.calories, 0);
  };

  const handleSaveMeal = () => {
    if (foodItems.length === 0) {
      onClose();
      return;
    }

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    const newMeal = {
      id: uuidv4(),
      type: selectedMealType,
      date: dateString,
      foodItems: foodItems,
      totalCalories: calculateCurrentMealTotal(),
    };

    setState(prevState => ({
      ...prevState,
      meals: [...prevState.meals, newMeal],
    }));
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} title="LOG NUTRITION">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
          {/* 1. Meal Type Switchboard */}
          <View style={styles.selectorContainer}>
            <Text style={styles.sectionLabel}>SELECT CATEGORY</Text>
            <View style={styles.selectorRow}>
                {(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as MealType[]).map(type => (
                <TouchableOpacity
                    key={type}
                    style={[
                    styles.typeBtn,
                    selectedMealType === type && styles.typeBtnActive,
                    ]}
                    onPress={() => setSelectedMealType(type)}
                >
                    <Text style={[
                    styles.typeBtnText,
                    selectedMealType === type && styles.typeBtnTextActive,
                    ]}>
                    {type}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* 2. Input Matrix */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>ADD ITEM DETAILS</Text>
            <View style={styles.inputRow}>
                {/* Food Name Input */}
                <View style={[styles.inputWrapper, {flex: 2}]}>
                    <TextInput
                        style={styles.input}
                        placeholder="ITEM NAME"
                        placeholderTextColor="#444"
                        value={foodName}
                        onChangeText={setFoodName}
                    />
                    <View style={styles.cornerMarker} />
                </View>

                {/* Calories Input */}
                <View style={[styles.inputWrapper, {flex: 1}]}>
                    <TextInput
                        style={[styles.input, {textAlign: 'center'}]}
                        placeholder="KCAL"
                        placeholderTextColor="#444"
                        keyboardType="numeric"
                        value={foodCalories}
                        onChangeText={setFoodCalories}
                    />
                    <View style={styles.cornerMarker} />
                </View>

                {/* Execute Button */}
                <TouchableOpacity onPress={addFoodItem} style={styles.addBtn}>
                    <Ionicons name="add" size={24} color="#000" />
                </TouchableOpacity>
            </View>
          </View>

          {/* 3. The Manifest (List) */}
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
                <Text style={styles.listHeaderTitle}>CURRENT INTAKE MANIFEST</Text>
                <Text style={styles.listHeaderCount}>{foodItems.length} ITEMS</Text>
            </View>

            {foodItems.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>NO DATA LOGGED</Text>
                </View>
            ) : (
                foodItems.map(item => (
                <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemCal}>{item.calories} <Text style={styles.unit}>KCAL</Text></Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFoodItem(item.id)} style={styles.deleteBtn}>
                        <Ionicons name="close" size={16} color={THEME.danger} />
                    </TouchableOpacity>
                </View>
                ))
            )}
          </View>

          {/* 4. Telemetry Readout */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>NET ENERGY</Text>
            <Text style={styles.totalValue}>
                {calculateCurrentMealTotal()} <Text style={styles.totalUnit}>KCAL</Text>
            </Text>
          </View>

        {/* 5. Commit Action */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleSaveMeal} style={styles.footerBtn}>
          <LinearGradient
            colors={[THEME.accent, '#1e40af']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>COMMIT TO DATABASE</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1, // Removed to prevent content from being cut off
    width: '100%',
  },
  
  // LABELS
  sectionLabel: {
      color: THEME.textSec,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 10,
  },

  // SELECTOR
  selectorContainer: {
      marginBottom: 24,
  },
  selectorRow: {
      flexDirection: 'row',
      backgroundColor: THEME.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      padding: 4,
  },
  typeBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 6,
  },
  typeBtnActive: {
      backgroundColor: '#222',
      borderWidth: 1,
      borderColor: '#333',
  },
  typeBtnText: {
      color: '#555',
      fontSize: 10,
      fontWeight: '800',
  },
  typeBtnTextActive: {
      color: THEME.textMain,
  },

  // INPUTS
  inputSection: {
      marginBottom: 24,
  },
  inputRow: {
      flexDirection: 'row',
      gap: 8,
      height: 48,
  },
  inputWrapper: {
      backgroundColor: THEME.inputBg,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      position: 'relative',
  },
  input: {
      flex: 1,
      color: THEME.textMain,
      fontSize: 14,
      fontWeight: '600',
      paddingHorizontal: 12,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cornerMarker: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 6,
      height: 6,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderColor: THEME.textSec,
  },
  addBtn: {
      width: 48,
      height: 48,
      backgroundColor: THEME.accent,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
  },

  // MANIFEST LIST
  listSection: {
      flex: 1,
      marginBottom: 20,
  },
  listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#222',
  },
  listHeaderTitle: {
      color: THEME.textSec,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1,
  },
  listHeaderCount: {
      color: THEME.accent,
      fontSize: 10,
      fontWeight: '800',
  },
  emptyState: {
      paddingVertical: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#222',
      borderStyle: 'dashed',
      borderRadius: 8,
  },
  emptyText: {
      color: '#333',
      fontSize: 12,
      fontWeight: '800',
  },
  itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0E0E0E',
      marginBottom: 8,
      padding: 12,
      borderRadius: 6,
      borderLeftWidth: 2,
      borderLeftColor: '#333',
  },
  itemInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
      marginRight: 16,
  },
  itemName: {
      color: THEME.textMain,
      fontSize: 14,
      fontWeight: '600',
  },
  itemCal: {
      color: THEME.accent,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontWeight: '700',
  },
  unit: {
      fontSize: 10,
      color: '#555',
  },
  deleteBtn: {
      padding: 4,
  },

  // TOTAL READOUT
  totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#080808',
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      marginBottom: 24,
  },
  totalLabel: {
      color: THEME.textSec,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1,
  },
  totalValue: {
      color: THEME.textMain,
      fontSize: 24,
      fontWeight: '900',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  totalUnit: {
      fontSize: 12,
      color: THEME.textSec,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },

  // FOOTER BTN
  footerBtn: {
      marginTop: 'auto',
  },
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

export default LogMealModal;