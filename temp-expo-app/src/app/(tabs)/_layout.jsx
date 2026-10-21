import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';

export default function TabsLayout() {
  const { language } = useApp();

  return (
    <View style={styles.container}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
            height: Platform.OS === 'ios' ? 84 : 65,
            paddingBottom: Platform.OS === 'ios' ? 24 : 10,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: language === 'hi' ? 'होम' : 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="scanner"
          options={{
            title: language === 'hi' ? 'स्कैन / टैग' : 'Scan Tag',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'qr-code' : 'qr-code-outline'} size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="patrol"
          options={{
            title: language === 'hi' ? 'गश्ती दल' : 'Patrol',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'} size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="care"
          options={{
            title: language === 'hi' ? 'गौशाला/चिकित्सा' : 'Shelters & Vets',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'medkit' : 'medkit-outline'} size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="more"
          options={{
            title: language === 'hi' ? 'अन्य सेवाएँ' : 'Services',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
