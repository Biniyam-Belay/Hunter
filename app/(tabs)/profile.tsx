import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  Dimensions
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
    accentDim: 'rgba(59, 130, 246, 0.1)',
    textMain: '#FFFFFF',
    textSec: '#888888',
    success: '#10B981',
    danger: '#EF4444',
};

// COMPONENT: The "Heatmap" Activity block
const ActivityHeatmap = () => {
    // Simulating activity levels (0-3)
    const activity = [1,2,3,2,1,0,3,3,2,1,0,2,3,1,2,3,2,0,1,2,3,3,1,2,1,3,2,1];
    
    return (
        <View style={styles.heatmapContainer}>
            <Text style={styles.sectionLabel}>CONSISTENCY_LOG // 30 DAYS</Text>
            <View style={styles.heatmapGrid}>
                {activity.map((level, i) => {
                    let bg = '#1a1a1a';
                    if(level === 1) bg = '#1e3a8a'; // Dark Blue
                    if(level === 2) bg = '#2563eb'; // Blue
                    if(level === 3) bg = '#60a5fa'; // Light Blue
                    
                    return (
                        <View key={i} style={[styles.heatBlock, {backgroundColor: bg}]} />
                    )
                })}
            </View>
        </View>
    )
}

// COMPONENT: Menu Row
const MenuOption = ({ icon, label, value, isDestructive }) => (
    <TouchableOpacity style={styles.menuRow}>
        <View style={styles.menuLeft}>
            <View style={styles.iconBox}>
                <FontAwesome6 name={icon} size={14} color={isDestructive ? THEME.danger : THEME.textMain} />
            </View>
            <Text style={[styles.menuLabel, isDestructive && {color: THEME.danger}]}>{label}</Text>
        </View>
        
        <View style={styles.menuRight}>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <Ionicons name="chevron-forward" size={14} color="#333" />
        </View>
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const [notifications, setNotifications] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                
                {/* 1. HEADER: The Identity Badge */}
                <View style={styles.header}>
                    <Text style={styles.screenTitle}>IDENTITY</Text>
                    <View style={styles.tierBadge}>
                        <Text style={styles.tierText}>PRO TIER</Text>
                    </View>
                </View>

                {/* 2. HERO PROFILE CARD */}
                <LinearGradient
                    colors={[THEME.card, '#050505']}
                    style={styles.profileCard}
                >
                    <View style={styles.profileRow}>
                        {/* Avatar with Ring */}
                        <View style={styles.avatarWrapper}>
                            <LinearGradient
                                colors={[THEME.accent, 'transparent']}
                                style={styles.avatarGradient}
                            >
                                <View style={styles.avatarInner}>
                                    <Text style={styles.avatarInitials}>JD</Text>
                                </View>
                            </LinearGradient>
                            <View style={styles.onlineDot} />
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>JOHN DOE</Text>
                            <Text style={styles.userHandle}>@johndoe_01</Text>
                            <View style={styles.joinDate}>
                                <Ionicons name="finger-print" size={12} color={THEME.textSec} />
                                <Text style={styles.joinText}>MEMBER SINCE 2023</Text>
                            </View>
                        </View>
                    </View>
                    
                    {/* Stats Row within the card */}
                    <View style={styles.miniStatsRow}>
                        <View style={styles.miniStat}>
                            <Text style={styles.statLabel}>WORKOUTS</Text>
                            <Text style={styles.statValue}>142</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.miniStat}>
                            <Text style={styles.statLabel}>HOURS</Text>
                            <Text style={styles.statValue}>320<Text style={styles.unit}>h</Text></Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.miniStat}>
                            <Text style={styles.statLabel}>SCORE</Text>
                            <Text style={styles.statValue}>980</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* 3. CONSISTENCY GRAPH */}
                <ActivityHeatmap />

                {/* 4. DEVICE STATUS (Tesla/Whoop Vibe) */}
                <Text style={styles.sectionLabel}>HARDWARE_LINK</Text>
                <View style={styles.deviceCard}>
                    <View style={styles.deviceInfo}>
                        <FontAwesome6 name="watch-smart" size={24} color={THEME.textMain} />
                        <View style={{marginLeft: 16}}>
                            <Text style={styles.deviceName}>VORTEX S4</Text>
                            <Text style={styles.deviceStatus}>CONNECTED • 92% BATTERY</Text>
                        </View>
                    </View>
                    <View style={styles.syncBtn}>
                        <Ionicons name="refresh" size={16} color={THEME.accent} />
                    </View>
                </View>

                {/* 5. SETTINGS MENU */}
                <Text style={styles.sectionLabel}>SYSTEM PREFERENCES</Text>
                <View style={styles.menuContainer}>
                    <MenuOption icon="user-gear" label="Account Details" />
                    <MenuOption icon="shield-halved" label="Privacy & Security" />
                    
                    {/* Toggle Row */}
                    <View style={styles.menuRow}>
                        <View style={styles.menuLeft}>
                            <View style={styles.iconBox}>
                                <FontAwesome6 name="bell" size={14} color={THEME.textMain} />
                            </View>
                            <Text style={styles.menuLabel}>Push Notifications</Text>
                        </View>
                        <Switch 
                            value={notifications} 
                            onValueChange={setNotifications}
                            trackColor={{ false: "#333", true: THEME.accent }}
                            thumbColor={"#FFF"}
                            ios_backgroundColor="#333"
                        />
                    </View>

                    <MenuOption icon="circle-question" label="Support" />
                </View>

                {/* 6. DANGER ZONE */}
                <View style={[styles.menuContainer, {marginTop: 24, borderColor: 'rgba(239, 68, 68, 0.2)'}]}>
                    <MenuOption icon="power-off" label="Terminate Session" isDestructive />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>VERSION 4.2.0 (BUILD 892)</Text>
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
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: THEME.textMain,
        letterSpacing: 1,
    },
    tierBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: THEME.accent,
    },
    tierText: {
        color: THEME.accent,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },

    // HERO CARD
    profileCard: {
        marginHorizontal: 24,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: THEME.cardBorder,
        marginBottom: 32,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 20,
    },
    avatarGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 2, // Width of the gradient border
    },
    avatarInner: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 28,
        fontWeight: '900',
        color: THEME.textMain,
        letterSpacing: 1,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '900',
        color: THEME.textMain,
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    userHandle: {
        fontSize: 14,
        color: THEME.accent,
        marginBottom: 8,
        fontWeight: '600',
    },
    joinDate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    joinText: {
        color: THEME.textSec,
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 6,
        letterSpacing: 0.5,
    },
    
    // MINI STATS ROW
    miniStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 16,
    },
    miniStat: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#222',
    },
    statLabel: {
        color: THEME.textSec,
        fontSize: 9,
        fontWeight: '800',
        marginBottom: 4,
        letterSpacing: 1,
    },
    statValue: {
        color: THEME.textMain,
        fontSize: 18,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    unit: {
        fontSize: 12,
        color: THEME.textSec,
    },

    // HEATMAP
    heatmapContainer: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    heatBlock: {
        width: (width - 48 - (13 * 6)) / 14, // Calc to fit roughly 14 items per row
        aspectRatio: 1,
        borderRadius: 2,
    },

    // DEVICE CARD
    deviceCard: {
        marginHorizontal: 24,
        backgroundColor: THEME.card,
        borderWidth: 1,
        borderColor: THEME.cardBorder,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deviceName: {
        color: THEME.textMain,
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    deviceStatus: {
        color: THEME.success,
        fontSize: 10,
        marginTop: 4,
        fontWeight: '700',
    },
    syncBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // MENU
    sectionLabel: {
        paddingHorizontal: 24,
        color: THEME.textSec,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 16,
    },
    menuContainer: {
        backgroundColor: THEME.card,
        marginHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: THEME.cardBorder,
        overflow: 'hidden',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuLabel: {
        color: THEME.textMain,
        fontSize: 14,
        fontWeight: '600',
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuValue: {
        color: THEME.textSec,
        fontSize: 12,
        marginRight: 8,
    },

    // FOOTER
    footer: {
        alignItems: 'center',
        marginTop: 24,
    },
    version: {
        color: '#333',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    }
});