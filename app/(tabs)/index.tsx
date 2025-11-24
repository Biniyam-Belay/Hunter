import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppState } from '../context/StateContext';

const { width } = Dimensions.get('window');

// THEME: "OBSIDIAN ELITE"
const THEME = {
    bg: '#000000',           
    cardDark: '#0A0A0A',     
    cardLight: '#171717',    
    accent: '#3B82F6',       
    accentDim: 'rgba(59, 130, 246, 0.15)',
    textMain: '#FFFFFF',
    textSec: '#888888',      
    border: '#262626',       
    success: '#10B981',      
    danger: '#EF4444',       
};

// COMPONENT: Manual Data Tile
const MetricTile = ({ label, value, unit, icon, trend, onPress }) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.tileWrapper} onPress={onPress}>
        <LinearGradient
            colors={[THEME.cardLight, THEME.cardDark]}
            style={styles.tile}
        >
            <View style={styles.tileHeader}>
                <FontAwesome6 name={icon} size={14} color={THEME.textSec} />
                {trend && (
                    <View style={styles.trendBadge}>
                        <FontAwesome6 name={trend === 'up' ? 'arrow-trend-up' : 'arrow-trend-down'} size={10} color={trend === 'up' ? THEME.success : THEME.danger} />
                    </View>
                )}
            </View>
            <View>
                <Text style={styles.tileValue}>{value} <Text style={styles.tileUnit}>{unit}</Text></Text>
                <Text style={styles.tileLabel}>{label}</Text>
            </View>
            
            <View style={styles.editIndicator}>
                <Ionicons name="add" size={10} color={THEME.border} />
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

// COMPONENT: Readiness based on User Input
const ReadinessDashboard = ({ readiness, vitals, onLogPress, onSleepPress, onMoodPress, onSorenessPress }) => (
    <View style={styles.dashboardContainer}>
        <LinearGradient
            colors={['#1a1a1a', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dashboardCard}
        >
            <View style={styles.dashHeader}>
                <Text style={styles.sectionTitle}>PERCEIVED READINESS</Text>
                <TouchableOpacity style={styles.liveBadge} onPress={onLogPress}>
                    <FontAwesome6 name="pen-to-square" size={10} color={THEME.accent} style={{marginRight: 6}} />
                    <Text style={styles.liveText}>LOG ENTRY</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gaugeRow}>
                <View>
                    <Text style={styles.gaugeValue}>{readiness.score} <Text style={styles.gaugePercent}>%</Text></Text>
                    <Text style={styles.gaugeStatus}>{readiness.status}</Text>
                </View>
                
                <View style={styles.miniGraph}>
                    {[10,18,12,24,35,28,15].map((h, i) => (
                        <View key={i} style={[styles.graphBar, {height: h, backgroundColor: i===4 ? THEME.accent : '#333'}]} />
                    ))}
                </View>
            </View>

            <View style={styles.dashFooter}>
                <TouchableOpacity style={styles.footerItem} onPress={onSleepPress}>
                    <Text style={styles.footerText}>SLEEP <Text style={styles.mono}>{vitals.sleep}</Text></Text>
                </TouchableOpacity>
                <View style={styles.dividerVertical} />
                <TouchableOpacity style={styles.footerItem} onPress={onMoodPress}>
                    <Text style={styles.footerText}>MOOD <Text style={styles.mono}>{vitals.mood}</Text></Text>
                </TouchableOpacity>
                <View style={styles.dividerVertical} />
                <TouchableOpacity style={styles.footerItem} onPress={onSorenessPress}>
                    <Text style={styles.footerText}>SORE <Text style={styles.mono}>{vitals.soreness}</Text></Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    </View>
);

// COMPONENT: Quick Input Button
const QuickLogButton = ({ label, icon, onPress }) => (
    <TouchableOpacity style={styles.quickLogBtn} onPress={onPress}>
        <View style={styles.quickLogIcon}>
             <FontAwesome6 name={icon} size={14} color={THEME.textMain} />
        </View>
        <Text style={styles.quickLogText}>{label}</Text>
        <Ionicons name="add" size={14} color={THEME.accent} />
    </TouchableOpacity>
);

const HomeScreen = () => {
    const { state } = useAppState();
    const { user, readiness, vitals, workout } = state;

    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <View>
                        <Text style={styles.date}>{dateString}</Text>
                        <Text style={styles.greeting}>Good Morning, <Text style={{color: THEME.textMain}}>{user.name}</Text></Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={() => console.log('Profile Pressed')}>
                        <LinearGradient colors={[THEME.cardLight, THEME.cardDark]} style={styles.profileGradient}>
                            <Text style={styles.profileInitials}>{user.initials}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <ReadinessDashboard 
                    readiness={readiness} 
                    vitals={vitals}
                    onLogPress={() => console.log('Log Entry Pressed')}
                    onSleepPress={() => console.log('Sleep Pressed')}
                    onMoodPress={() => console.log('Mood Pressed')}
                    onSorenessPress={() => console.log('Soreness Pressed')}
                />

                <Text style={styles.sectionLabel}>UPDATE VITALS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickLogScroll}>
                    <QuickLogButton label="Weight" icon="weight-scale" onPress={() => console.log('Log Weight')} />
                    <QuickLogButton label="Water" icon="glass-water" onPress={() => console.log('Log Water')} />
                    <QuickLogButton label="Sleep" icon="bed" onPress={() => console.log('Log Sleep')} />
                    <QuickLogButton label="Mood" icon="face-smile" onPress={() => console.log('Log Mood')} />
                </ScrollView>

                <Text style={[styles.sectionLabel, {marginTop: 24}]}>METRICS // TODAY</Text>
                <View style={styles.gridContainer}>
                    <MetricTile icon="person-walking" label="CARDIO" value={vitals.cardio} unit="MIN" trend="up" onPress={() => console.log('Cardio Pressed')} />
                    <MetricTile icon="fire" label="CALORIES" value={vitals.calories} unit="KCAL" trend="up" onPress={() => console.log('Calories Pressed')} />
                    <MetricTile icon="glass-water" label="HYDRATION" value={vitals.water} unit="L" onPress={() => console.log('Hydration Pressed')} />
                    <MetricTile icon="weight-scale" label="WEIGHT" value={vitals.weight} unit="KG" onPress={() => console.log('Weight Pressed')} />
                </View>

                <View style={styles.agendaHeader}>
                    <Text style={styles.sectionLabel}>PROTOCOL // 16:00</Text>
                    <TouchableOpacity onPress={() => console.log('View Plan Pressed')}>
                        <Text style={styles.seeAll}>VIEW PLAN</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={() => console.log('Workout Card Pressed')}>
                    <LinearGradient
                        colors={[THEME.accent, '#1E40AF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.workoutCard}
                    >
                        <View style={styles.workoutContent}>
                            <View style={styles.workoutIconBg}>
                                <FontAwesome6 name="dumbbell" size={20} color="white" />
                            </View>
                            <View>
                                <Text style={styles.workoutTitle}>{workout.title}</Text>
                                <Text style={styles.workoutSub}>{workout.description}</Text>
                            </View>
                        </View>
                        <View style={styles.workoutMeta}>
                            <Text style={styles.workoutTime}>{workout.duration} MIN</Text>
                            <Ionicons name="arrow-forward-circle" size={28} color="white" style={{opacity: 0.8}} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={[styles.agendaHeader, {marginTop: 32}]}>
                     <Text style={styles.sectionLabel}>RECOVERY ESTIMATE</Text>
                </View>
                <View style={styles.recoveryRow}>
                    <View style={styles.recoveryItem}>
                         <View style={[styles.dot, {backgroundColor: THEME.success}]} />
                         <Text style={styles.recoveryText}>Sleep Quality</Text>
                    </View>
                    <View style={styles.recoveryItem}>
                         <View style={[styles.dot, {backgroundColor: '#F59E0B'}]} />
                         <Text style={styles.recoveryText}>Soreness Level</Text>
                    </View>
                </View>

                <View style={{height: 100}} /> 
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: THEME.bg },
    container: { flex: 1, paddingHorizontal: 20 },
    
    // HEADER
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
    date: { color: THEME.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 4, textTransform: 'uppercase' },
    greeting: { color: THEME.textSec, fontSize: 22, fontWeight: '400', letterSpacing: 0.5 },
    profileGradient: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border },
    profileInitials: { color: THEME.textMain, fontWeight: '700', fontSize: 16 },

    // DASHBOARD
    dashboardContainer: { marginBottom: 32, shadowColor: THEME.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 20 },
    dashboardCard: { borderRadius: 24, padding: 24, borderWidth: 1, borderColor: THEME.border },
    dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { color: THEME.textSec, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
    liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
    liveText: { color: THEME.accent, fontSize: 10, fontWeight: '700' },
    gaugeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
    gaugeValue: { color: THEME.textMain, fontSize: 56, fontWeight: '300', letterSpacing: -2, lineHeight: 60, fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' },
    gaugePercent: { fontSize: 24, color: THEME.textSec, fontWeight: '400' },
    gaugeStatus: { color: THEME.accent, fontSize: 13, fontWeight: '600', letterSpacing: 0.5, marginTop: 4 },
    miniGraph: { flexDirection: 'row', alignItems: 'flex-end', height: 40, paddingBottom: 8, gap: 4 },
    graphBar: { width: 6, borderRadius: 2 },
    
    // FOOTER (Interactive)
    dashFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 },
    footerItem: { flexDirection: 'row', alignItems: 'center' },
    footerText: { color: THEME.textSec, fontSize: 11, fontWeight: '600' },
    mono: { color: THEME.textMain, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: '500', marginLeft: 6 },
    dividerVertical: { width: 1, height: 12, backgroundColor: '#333', marginHorizontal: 16 },

    // QUICK LOG SCROLL
    quickLogScroll: { flexDirection: 'row', marginBottom: 8, overflow: 'visible' },
    quickLogBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.cardDark, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: THEME.border, marginRight: 10 },
    quickLogIcon: { marginRight: 8 },
    quickLogText: { color: THEME.textSec, fontSize: 12, fontWeight: '700', marginRight: 8 },

    // METRICS GRID
    sectionLabel: { color: THEME.textSec, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 16 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 32 },
    tileWrapper: { width: (width - 52) / 2, height: 100, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
    tile: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: THEME.border, justifyContent: 'space-between' },
    tileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    trendBadge: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 6 },
    tileValue: { color: THEME.textMain, fontSize: 22, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    tileUnit: { fontSize: 12, color: THEME.textSec, fontWeight: '500', fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' },
    tileLabel: { color: THEME.textSec, fontSize: 10, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
    editIndicator: { position: 'absolute', bottom: 12, right: 12, opacity: 0.5 },

    // WORKOUT CARD
    agendaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
    seeAll: { color: THEME.accent, fontSize: 12, fontWeight: '700' },
    workoutCard: { borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: THEME.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
    workoutContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    workoutIconBg: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    workoutTitle: { color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 2 },
    workoutSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    workoutMeta: { alignItems: 'flex-end', gap: 8 },
    workoutTime: { color: 'white', fontSize: 12, fontWeight: '800', opacity: 0.9 },

    // RECOVERY STRIP
    recoveryRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 4 },
    recoveryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.cardDark, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: THEME.border },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
    recoveryText: { color: THEME.textSec, fontSize: 12, fontWeight: '500' }
});

export default HomeScreen;