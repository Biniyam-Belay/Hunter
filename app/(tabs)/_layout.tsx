import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// THEME: Minimalist Obsidian
const THEME = {
  bg: '#000000',           
  barBg: '#050505',        // Deep matte black (almost void)
  accent: '#3B82F6',       // Electric Blue
  inactive: '#404040',     // Dark Grey
  active: '#FFFFFF',       // Pure White for active icons (Cleaner)
  border: '#1F1F1F',       // Razor thin separator
};

// COMPONENT: Minimal Tab Icon
// No spotlight, just clean lines and a precision dot
const TabIcon = ({ name, color, focused, library = "Ionicons" }) => {
    const IconLib = library === "FontAwesome6" ? FontAwesome6 : Ionicons;
    
    return (
        <View style={styles.iconWrapper}>
            <IconLib 
                name={name} 
                size={22} // Slightly smaller for minimal feel
                color={focused ? THEME.active : THEME.inactive} 
            />
            {/* The Precision Dot */}
            {focused && <View style={styles.activeDot} />}
        </View>
    );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        // Flat, matte background with a razor top border
        tabBarBackground: () => (
            <View style={styles.barBackground}>
                <View style={styles.hairlineBorder} />
            </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "grid" : "grid-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "compass" : "compass-outline"} focused={focused} />
          ),
        }}
      />
      
      {/* THE "CHIP" BUTTON (Minimal Center) */}
      <Tabs.Screen
        name="workout"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButtonContainer}>
                <LinearGradient
                    colors={[THEME.accent, '#1d4ed8']}
                    style={styles.centerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <FontAwesome6 name="plus" size={20} color="white" />
                </LinearGradient>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "stats-chart" : "stats-chart-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="user" focused={focused} library="FontAwesome6" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // BAR STRUCTURE
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 65,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
  },
  barBackground: {
    flex: 1,
    backgroundColor: THEME.barBg,
  },
  hairlineBorder: {
    height: 1,
    width: '100%',
    backgroundColor: THEME.border,
  },

  // ICONS
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.accent,
    position: 'absolute',
    bottom: 10, // Tighter spacing
  },

  // CENTER "CHIP" BUTTON
  centerButtonContainer: {
      top: -12, // Subtle lift, not a huge float
      alignItems: 'center',
      justifyContent: 'center',
  },
  centerButton: {
      width: 52,
      height: 52,
      borderRadius: 16, // "Squircle" shape (Modern Tech look)
      justifyContent: 'center',
      alignItems: 'center',
      
      // Minimal Shadow - just enough to separate depth
      shadowColor: THEME.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      
      // Subtle top highlight for 3D glass effect
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.2)',
  },
});