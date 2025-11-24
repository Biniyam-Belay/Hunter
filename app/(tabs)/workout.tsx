import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// THEME: "OBSIDIAN ELITE"
const THEME = {
    bg: '#000000',
    card: '#0B0B0B',
    cardBorder: '#1F1F1F',
    accent: '#3B82F6',       
    textMain: '#FFFFFF',
    textSec: '#888888',
};

// DATA: Enhanced with "Tech" specs
const PROTOCOLS = [
    { 
        id: 'OP_01',
        title: 'THE FORGE', 
        subtitle: 'Heavy Compound Strength', 
        icon: 'dumbbell', 
        color: '#F97316', // Orange/Iron
        time: '60-90 MIN',
        intensity: 'HIGH'
    },
    { 
        id: 'OP_02',
        title: 'THE CRUCIBLE', 
        subtitle: 'Metabolic Conditioning', 
        icon: 'fire', 
        color: '#EF4444', // Red/Fire
        time: '25-40 MIN',
        intensity: 'EXTREME'
    },
    { 
        id: 'OP_03',
        title: 'THE PATH', 
        subtitle: 'Steady State Endurance', 
        icon: 'person-running', 
        color: '#3B82F6', // Blue/Air
        time: '45+ MIN',
        intensity: 'MODERATE'
    },
    { 
        id: 'OP_04',
        title: 'THE SANCTUARY', 
        subtitle: 'Active Recovery & Flow', 
        icon: 'spa', 
        color: '#10B981', // Green/Earth
        time: '30 MIN',
        intensity: 'LOW'
    },
];

// COMPONENT: The "Mission" Card
const ProtocolCard = ({ data }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardWrapper}>
        <LinearGradient
            colors={[THEME.card, '#050505']}
            style={styles.card}
        >
            {/* Top Row: ID and Icon */}
            <View style={styles.cardHeader}>
                <Text style={styles.cardId}>{data.id}</Text>
                <View style={[styles.iconBox, {backgroundColor: `${data.color}15`, borderColor: `${data.color}30`}]}>
                    <FontAwesome6 name={data.icon} size={16} color={data.color} />
                </View>
            </View>

            {/* Middle: Title */}
            <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{data.title}</Text>
                <Text style={styles.cardSub}>{data.subtitle}</Text>
            </View>

            {/* Divider Line */}
            <View style={styles.divider} />

            {/* Bottom: Stats */}
            <View style={styles.cardFooter}>
                <View style={styles.statTag}>
                    <Ionicons name="time-outline" size={12} color={THEME.textSec} />
                    <Text style={styles.statText}>{data.time}</Text>
                </View>
                <View style={styles.statTag}>
                    <MaterialCommunityIcons name="lightning-bolt-outline" size={14} color={data.color} />
                    <Text style={[styles.statText, {color: data.color}]}>{data.intensity}</Text>
                </View>
            </View>
            
            {/* Action Chevron */}
            <View style={styles.chevronBox}>
                <Ionicons name="caret-forward" size={14} color="#333" />
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

export default function WorkoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* 1. HEADER */}
        <View style={styles.header}>
            <View>
                <Text style={styles.headerSub}>READY STATUS: GREEN</Text>
                <Text style={styles.headerTitle}>INITIATE</Text>
            </View>
            <View style={styles.liveIndicator}>
                <View style={styles.pulse} />
                <Text style={styles.liveText}>SYSTEM ONLINE</Text>
            </View>
        </View>

        {/* 2. HERO: FREESTYLE / QUICK START */}
        <View style={styles.section}>
            <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient
                    colors={[THEME.accent, '#1E40AF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroButton}
                >
                    <View style={styles.heroContent}>
                        <View style={styles.heroIcon}>
                            <FontAwesome6 name="plus" size={24} color="white" />
                        </View>
                        <View>
                            <Text style={styles.heroTitle}>QUICK START</Text>
                            <Text style={styles.heroSub}>MANUAL FREESTYLE SESSION</Text>
                        </View>
                    </View>
                    <Ionicons name="arrow-forward-circle" size={32} color="rgba(255,255,255,0.8)" />
                </LinearGradient>
            </TouchableOpacity>
        </View>

        {/* 3. PROTOCOLS GRID */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>SELECT PROTOCOL</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.grid}>
                {PROTOCOLS.map((item, index) => (
                    <ProtocolCard key={index} data={item} />
                ))}
            </View>
        </View>

        {/* 4. TEMPLATES / BUILDER */}
        <View style={styles.section}>
            <TouchableOpacity style={styles.builderButton}>
                <View style={styles.builderLeft}>
                    <MaterialCommunityIcons name="pencil-ruler" size={20} color={THEME.textSec} />
                    <Text style={styles.builderText}>BUILD CUSTOM ROUTINE</Text>
                </View>
                <FontAwesome6 name="chevron-right" size={12} color={THEME.textSec} />
            </TouchableOpacity>
        </View>

        <View style={{height: 100}} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  scrollView: { flex: 1, paddingHorizontal: 24 },
  
  // HEADER
  header: {
      paddingTop: 16,
      paddingBottom: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  headerSub: {
      color: THEME.accent,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 4,
  },
  headerTitle: {
      color: THEME.textMain,
      fontSize: 28,
      fontWeight: '900',
      letterSpacing: 0.5,
  },
  liveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  pulse: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#10B981',
      marginRight: 6,
  },
  liveText: {
      color: '#10B981',
      fontSize: 9,
      fontWeight: '700',
  },

  // HERO BUTTON
  section: {
      marginBottom: 32,
  },
  heroButton: {
      borderRadius: 16,
      padding: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: THEME.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
  },
  heroContent: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  heroIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
  },
  heroTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 2,
      letterSpacing: 0.5,
  },
  heroSub: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.5,
  },

  // PROTOCOLS
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  sectionTitle: {
      color: THEME.textSec,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.2,
      marginRight: 12,
  },
  line: {
      flex: 1,
      height: 1,
      backgroundColor: '#222',
  },
  grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 16,
  },

  // CARD
  cardWrapper: {
      width: (width - 48 - 16) / 2, // 2 Column
      height: 180,
  },
  card: {
      flex: 1,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      justifyContent: 'space-between',
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  cardId: {
      color: THEME.textSec,
      fontSize: 10,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      opacity: 0.5,
  },
  iconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
  },
  cardBody: {
      marginTop: 8,
  },
  cardTitle: {
      color: THEME.textMain,
      fontSize: 14,
      fontWeight: '900',
      fontStyle: 'italic',
      marginBottom: 4,
      letterSpacing: 0.5,
  },
  cardSub: {
      color: THEME.textSec,
      fontSize: 10,
      lineHeight: 14,
  },
  divider: {
      height: 1,
      backgroundColor: '#1A1A1A',
      marginVertical: 12,
  },
  cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  statTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  statText: {
      color: THEME.textSec,
      fontSize: 9,
      fontWeight: '700',
  },
  chevronBox: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      opacity: 0.5,
  },

  // BUILDER BUTTON
  builderButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#080808',
      borderWidth: 1,
      borderColor: '#222',
      borderStyle: 'dashed', // Dashed border for "Construction/Blueprint" feel
      padding: 20,
      borderRadius: 12,
  },
  builderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  builderText: {
      color: THEME.textSec,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
  }
});