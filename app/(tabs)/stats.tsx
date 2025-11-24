import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// THEME: "OBSIDIAN ELITE"
const THEME = {
    bg: '#000000',
    card: '#0A0A0A',
    cardBorder: '#1F1F1F',
    accent: '#3B82F6',       
    accentDim: 'rgba(59, 130, 246, 0.15)',
    textMain: '#FFFFFF',
    textSec: '#888888',
    success: '#10B981',
    danger: '#EF4444',
    gridLine: '#1a1a1a'
};

// COMPONENT: Time Range Selector
const SegmentControl = () => {
    const [active, setActive] = useState('WEEK');
    const segments = ['DAY', 'WEEK', 'MONTH', 'YEAR'];

    return (
        <View style={styles.segmentContainer}>
            {segments.map((seg) => (
                <TouchableOpacity 
                    key={seg} 
                    onPress={() => setActive(seg)}
                    style={[styles.segmentBtn, active === seg && styles.segmentActive]}
                >
                    <Text style={[styles.segmentText, active === seg && {color: '#FFF'}]}>{seg}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// COMPONENT: The Main Histogram Chart
const VolumeChart = () => {
    const data = [45, 70, 30, 85, 50, 95, 20]; // Mock data
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <View>
                    <Text style={styles.chartLabel}>TOTAL VOLUME LOAD</Text>
                    <Text style={styles.chartValue}>42,195 <Text style={styles.unit}>KG</Text></Text>
                </View>
                <View style={styles.trendBadge}>
                    <FontAwesome6 name="arrow-trend-up" size={12} color={THEME.success} />
                    <Text style={styles.trendText}>+12%</Text>
                </View>
            </View>

            {/* The Bars */}
            <View style={styles.graphArea}>
                {/* Background Grid Lines */}
                <View style={styles.gridLines}>
                    <View style={styles.gridLine} />
                    <View style={styles.gridLine} />
                    <View style={styles.gridLine} />
                </View>

                {data.map((h, i) => (
                    <View key={i} style={styles.barWrapper}>
                        <View style={styles.barTrack}>
                            <LinearGradient
                                colors={[THEME.accent, 'rgba(59, 130, 246, 0.1)']}
                                style={[styles.barFill, {height: `${h}%`}]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                            />
                        </View>
                        <Text style={styles.dayLabel}>{days[i]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// COMPONENT: Detailed Stat Tile
const StatTile = ({ label, value, unit, icon, color, trend }) => (
    <View style={styles.statTile}>
        <View style={styles.statHeader}>
            <View style={[styles.iconBox, {backgroundColor: `${color}20`}]}>
                <FontAwesome6 name={icon} size={14} color={color} />
            </View>
            {trend && (
                <Text style={[styles.miniTrend, {color: trend > 0 ? THEME.success : THEME.danger}]}>
                    {trend > 0 ? '+' : ''}{trend}%
                </Text>
            )}
        </View>
        <View>
            <Text style={styles.tileValue}>{value}<Text style={styles.tileUnit}>{unit}</Text></Text>
            <Text style={styles.tileLabel}>{label}</Text>
        </View>
    </View>
);

// COMPONENT: Muscle Distribution Bar
const DistributionRow = ({ label, percent, color }) => (
    <View style={styles.distRow}>
        <View style={styles.distHeader}>
            <Text style={styles.distLabel}>{label}</Text>
            <Text style={styles.distPercent}>{percent}%</Text>
        </View>
        <View style={styles.distTrack}>
            <View style={[styles.distFill, {width: `${percent}%`, backgroundColor: color}]} />
        </View>
    </View>
);

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* 1. HEADER */}
        <View style={styles.header}>
            <View>
                <Text style={styles.dateRange}>NOV 14 - NOV 21</Text>
                <Text style={styles.screenTitle}>ANALYTICS</Text>
            </View>
            <TouchableOpacity style={styles.exportBtn}>
                <MaterialCommunityIcons name="export-variant" size={20} color={THEME.textMain} />
            </TouchableOpacity>
        </View>

        {/* 2. CONTROLS */}
        <SegmentControl />

        {/* 3. MAIN CHART (Volume) */}
        <VolumeChart />

        {/* 4. STATS GRID */}
        <View style={styles.gridContainer}>
            <StatTile 
                label="WORKOUTS" 
                value="6" 
                unit="" 
                icon="dumbbell" 
                color="#F59E0B" 
                trend={0} 
            />
             <StatTile 
                label="DURATION" 
                value="8.2" 
                unit="h" 
                icon="clock" 
                color="#10B981" 
                trend={5.2} 
            />
            <StatTile 
                label="CALORIES" 
                value="4.2" 
                unit="k" 
                icon="fire" 
                color="#EF4444" 
                trend={-2.4} 
            />
            <StatTile 
                label="INTENSITY" 
                value="88" 
                unit="%" 
                icon="heart-pulse" 
                color="#8B5CF6" 
                trend={1.8} 
            />
        </View>

        {/* 5. SPLIT BREAKDOWN */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>MUSCLE GROUP SPLIT</Text>
            <View style={styles.splitCard}>
                <DistributionRow label="CHEST & TRICEPS (PUSH)" percent={45} color={THEME.accent} />
                <DistributionRow label="BACK & BICEPS (PULL)" percent={30} color="#8B5CF6" />
                <DistributionRow label="LEGS & CORE" percent={25} color="#F59E0B" />
            </View>
        </View>
        
        <View style={{height: 100}} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  scrollView: { flex: 1 },

  // HEADER
  header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  dateRange: {
      color: THEME.accent,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 4,
  },
  screenTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: THEME.textMain,
      letterSpacing: 0.5,
  },
  exportBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: THEME.card,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      justifyContent: 'center',
      alignItems: 'center',
  },

  // SEGMENT CONTROL
  segmentContainer: {
      flexDirection: 'row',
      marginHorizontal: 24,
      backgroundColor: THEME.card,
      padding: 4,
      borderRadius: 12,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
  },
  segmentBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 8,
  },
  segmentActive: {
      backgroundColor: '#222',
  },
  segmentText: {
      color: THEME.textSec,
      fontSize: 10,
      fontWeight: '700',
  },

  // CHART
  chartContainer: {
      marginHorizontal: 24,
      backgroundColor: THEME.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      padding: 20,
      marginBottom: 24,
  },
  chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
  },
  chartLabel: {
      color: THEME.textSec,
      fontSize: 10,
      fontWeight: '700',
      marginBottom: 4,
      letterSpacing: 1,
  },
  chartValue: {
      color: THEME.textMain,
      fontSize: 24,
      fontWeight: '900',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  unit: {
      fontSize: 14,
      color: THEME.textSec,
  },
  trendBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  trendText: {
      color: THEME.success,
      fontSize: 10,
      fontWeight: '700',
      marginLeft: 4,
  },
  graphArea: {
      height: 150,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      position: 'relative',
  },
  gridLines: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'space-between',
      paddingVertical: 10,
  },
  gridLine: {
      width: '100%',
      height: 1,
      backgroundColor: THEME.gridLine,
  },
  barWrapper: {
      alignItems: 'center',
      width: 24,
      height: '100%',
      justifyContent: 'flex-end',
  },
  barTrack: {
      width: 8,
      height: '85%',
      backgroundColor: '#151515',
      borderRadius: 4,
      justifyContent: 'flex-end',
      overflow: 'hidden',
  },
  barFill: {
      width: '100%',
      borderRadius: 4,
  },
  dayLabel: {
      color: THEME.textSec,
      fontSize: 10,
      marginTop: 8,
      fontWeight: '700',
  },

  // STATS GRID
  gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 24,
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 32,
  },
  statTile: {
      width: (width - 48 - 12) / 2,
      backgroundColor: THEME.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      justifyContent: 'space-between',
      height: 100,
  },
  statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  iconBox: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
  },
  miniTrend: {
      fontSize: 10,
      fontWeight: '700',
  },
  tileValue: {
      color: THEME.textMain,
      fontSize: 20,
      fontWeight: '900',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tileUnit: {
      fontSize: 12,
      color: THEME.textSec,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  tileLabel: {
      color: THEME.textSec,
      fontSize: 9,
      fontWeight: '800',
      marginTop: 2,
      letterSpacing: 1,
  },

  // BREAKDOWN
  section: {
      paddingHorizontal: 24,
  },
  sectionTitle: {
      color: THEME.textSec,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.2,
      marginBottom: 16,
  },
  splitCard: {
      backgroundColor: THEME.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      padding: 20,
      gap: 20,
  },
  distRow: {
      gap: 8,
  },
  distHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  distLabel: {
      color: THEME.textMain,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
  },
  distPercent: {
      color: THEME.textSec,
      fontSize: 11,
      fontWeight: '700',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  distTrack: {
      height: 6,
      backgroundColor: '#1a1a1a',
      borderRadius: 3,
      overflow: 'hidden',
  },
  distFill: {
      height: '100%',
      borderRadius: 3,
  },
});