import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
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
    accent: '#3B82F6',       // Electric Blue
    textMain: '#FFFFFF',
    textSec: '#888888',
    inputBg: 'rgba(255, 255, 255, 0.05)',
};

// DATA: Strictly Bodybuilding & Running
const CATEGORIES = [
    { title: 'HYPERTROPHY', count: 'GYM • 42 PLANS', icon: 'dumbbell', color: '#EF4444' }, // Red (Muscle)
    { title: 'HOME IRON', count: 'DB • 18 PLANS', icon: 'house', color: '#F97316' }, // Orange (Home)
    { title: 'TRACK RUN', count: 'SPEED • 12 PLANS', icon: 'stopwatch', color: '#3B82F6' }, // Blue (Speed)
    { title: 'POWERLIFTING', count: 'BARBELL • 15 PLANS', icon: 'weight-hanging', color: '#EF4444' }, // Red
    { title: 'CALISTHENICS', count: 'BW • 24 PLANS', icon: 'person', color: '#EAB308' }, // Yellow
    { title: 'DISTANCE', count: 'AEROBIC • 09 PLANS', icon: 'route', color: '#10B981' }, // Green (Endurance)
    { title: 'ABS & CORE', count: 'ISOLATION • 31 PLANS', icon: 'cube', color: '#8B5CF6' }, // Violet
    { title: 'MOBILITY', count: 'REPAIR • 14 PLANS', icon: 'person-stretching', color: '#06B6D4' }, // Cyan
];

// COMPONENT: Featured/Trending Card
const TrendingCard = ({ title, subtitle, difficulty, color, icon }) => (
    <TouchableOpacity style={styles.trendingCard}>
        <LinearGradient
            colors={['#111', '#050505']}
            style={styles.trendingGradient}
        >
            {/* Background Color Leak */}
            <LinearGradient 
                colors={[color, 'transparent']} 
                style={styles.cardGlow} 
                start={{x: 1, y: 0}} 
                end={{x: 0, y: 1}} 
            />
            
            <View style={styles.trendingContent}>
                <View style={styles.trendingHeader}>
                    <View style={styles.trendingBadge}>
                        <Text style={[styles.badgeText, {color: color}]}>{difficulty}</Text>
                    </View>
                    <FontAwesome6 name={icon} size={14} color={THEME.textSec} />
                </View>
                <View>
                    <Text style={styles.trendingTitle}>{title}</Text>
                    <Text style={styles.trendingSub}>{subtitle}</Text>
                </View>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// COMPONENT: Category Module
const CategoryModule = ({ item }) => (
    <TouchableOpacity style={styles.catCardWrapper}>
        <LinearGradient
            colors={[THEME.card, '#050505']}
            style={styles.catCard}
        >
            <View style={styles.catHeader}>
                <View style={[styles.iconBox, { borderColor: item.color }]}>
                     {/* The icon glows with the category color */}
                    <FontAwesome6 name={item.icon} size={14} color={item.color} />
                </View>
                <Ionicons name="arrow-forward" size={12} color={THEME.textSec} />
            </View>
            
            <View style={styles.catBody}>
                <Text style={styles.catTitle}>{item.title}</Text>
                <Text style={styles.catCount}>{item.count}</Text>
            </View>
            
            {/* Subtle Gradient wash at bottom right */}
            <LinearGradient
                colors={[item.color, 'transparent']}
                style={styles.catWash}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
            />
        </LinearGradient>
    </TouchableOpacity>
);

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* 1. HEADER */}
        <View style={styles.header}>
            <View>
                <Text style={styles.headerSubtitle}>PROTOCOL_LIBRARY</Text>
                <Text style={styles.headerTitle}>EXPLORE</Text>
            </View>
            <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={20} color={THEME.textMain} />
            </TouchableOpacity>
        </View>

        {/* 2. SEARCH CONSOLE */}
        <View style={styles.searchSection}>
            <LinearGradient
                colors={[THEME.inputBg, 'rgba(0,0,0,0.8)']}
                style={styles.searchBar}
            >
                <Ionicons name="search" size={18} color={THEME.accent} style={{marginRight: 12}} />
                <TextInput 
                    placeholder="SEARCH OPERATIONS..." 
                    placeholderTextColor={THEME.textSec}
                    style={styles.input}
                />
                <View style={styles.commandKey}>
                    <Text style={styles.commandText}>/</Text>
                </View>
            </LinearGradient>
        </View>

        {/* 3. TRENDING OPS (Horizontal Scroll) */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>FEATURED OPS</Text>
                <Ionicons name="chevron-forward" size={14} color={THEME.accent} />
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
                <TrendingCard 
                    title="THE 5x5 PROTOCOL" 
                    subtitle="Pure Strength Foundation" 
                    difficulty="NOVICE" 
                    color="#EF4444" 
                    icon="dumbbell"
                />
                <TrendingCard 
                    title="SPRINT INTERVALS" 
                    subtitle="VO2 Max Development" 
                    difficulty="ELITE" 
                    color="#3B82F6" 
                    icon="stopwatch"
                />
                <TrendingCard 
                    title="HOME DUMBBELL" 
                    subtitle="Hypertrophy A/B Split" 
                    difficulty="INTERMEDIATE" 
                    color="#F59E0B" 
                    icon="house"
                />
            </ScrollView>
        </View>

        {/* 4. CATEGORY GRID */}
        <View style={styles.section}>
            <Text style={styles.sectionLabel}>CLASSIFICATIONS</Text>
            <View style={styles.grid}>
                {CATEGORIES.map((cat, index) => (
                    <CategoryModule key={index} item={cat} />
                ))}
            </View>
        </View>

        {/* Bottom spacer for the Tab Bar */}
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
      paddingBottom: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  headerSubtitle: {
      color: THEME.accent,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.5,
      marginBottom: 4,
  },
  headerTitle: {
      color: THEME.textMain,
      fontSize: 28,
      fontWeight: '800', // Heavy bold
      letterSpacing: 0.5,
  },
  filterBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: THEME.card,
  },

  // SEARCH
  searchSection: {
      paddingHorizontal: 24,
      marginBottom: 32,
  },
  searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 52,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      paddingHorizontal: 16,
  },
  input: {
      flex: 1,
      color: THEME.textMain,
      fontSize: 14,
      fontWeight: '600',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Tech feel
  },
  commandKey: {
      width: 24,
      height: 24,
      borderRadius: 6,
      backgroundColor: '#222',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#333',
  },
  commandText: {
      color: THEME.textSec,
      fontSize: 12,
      fontWeight: 'bold',
  },

  // SECTION COMMON
  section: {
      marginBottom: 32,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      marginBottom: 16,
  },
  sectionLabel: {
      color: THEME.textSec,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.2,
      paddingHorizontal: 24,
      marginBottom: 16,
  },

  // TRENDING SCROLL
  trendingScroll: {
      paddingLeft: 24,
      paddingRight: 8,
  },
  trendingCard: {
      width: 240,
      height: 140,
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
  },
  trendingGradient: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      padding: 16,
      justifyContent: 'space-between',
      overflow: 'hidden',
  },
  cardGlow: {
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0,
      opacity: 0.15,
  },
  trendingContent: {
      flex: 1,
      justifyContent: 'space-between',
  },
  trendingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  trendingBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
  },
  trendingTitle: {
      color: THEME.textMain,
      fontSize: 16,
      fontWeight: '800',
      fontStyle: 'italic',
      letterSpacing: 0.5,
      marginTop: 8,
  },
  trendingSub: {
      color: THEME.textSec,
      fontSize: 12,
      marginTop: 2,
  },

  // CATEGORY GRID
  grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 24,
      justifyContent: 'space-between',
      gap: 12,
  },
  catCardWrapper: {
      width: (width - 48 - 12) / 2, // 2 Column
      height: 110,
  },
  catCard: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: THEME.cardBorder,
      padding: 16,
      justifyContent: 'space-between',
      overflow: 'hidden',
  },
  catHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  iconBox: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
  },
  catBody: {
      zIndex: 2,
  },
  catTitle: {
      color: THEME.textMain,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.5,
      marginBottom: 2,
  },
  catCount: {
      color: THEME.textSec,
      fontSize: 10,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  catWash: {
      position: 'absolute',
      bottom: -20,
      right: -20,
      width: 80,
      height: 80,
      borderRadius: 40,
      opacity: 0.15,
      transform: [{ scale: 1.5 }]
  },

});