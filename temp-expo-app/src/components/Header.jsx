import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function Header() {
  const insets = useSafeAreaInsets();
  const { user, language, setLanguage, isBackendOnline, refreshState } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case 'admin':
        return { label: language === 'hi' ? 'प्रशासक' : 'Admin', bg: '#EDE9FE', color: '#7C3AED' };
      case 'patrol_squad':
        return { label: language === 'hi' ? 'गश्ती दल' : 'Patrol', bg: '#FEE2E2', color: '#DC2626' };
      case 'tagging_agent':
        return { label: language === 'hi' ? 'टैगिंग एजेंट' : 'Tag Agent', bg: '#FEF3C7', color: '#D97706' };
      case 'gaushala_manager':
        return { label: language === 'hi' ? 'गौशाला' : 'Gaushala', bg: '#E0E7FF', color: '#4F46E5' };
      default:
        return { label: language === 'hi' ? 'नागरिक' : 'Citizen', bg: '#ECFDF5', color: '#059669' };
    }
  };

  const role = getRoleBadge();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.topRow}>
        <View style={styles.branding}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Pashu Care</Text>
              <View style={[styles.statusDot, { backgroundColor: isBackendOnline ? '#10B981' : '#F59E0B' }]} />
            </View>
            <Text style={styles.subtitle}>
              {language === 'hi' ? 'सुरक्षित गौवंश प्रणाली' : 'Safe Cow Management'}
            </Text>
          </View>
        </View>

        <View style={styles.actionGroup}>
          {/* Language Switcher Button */}
          <TouchableOpacity
            style={styles.langBtn}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Ionicons name="language" size={14} color="#059669" />
            <Text style={styles.langText}>{language === 'hi' ? 'EN' : 'हिं'}</Text>
          </TouchableOpacity>

          {/* Sync / Refresh Button */}
          <TouchableOpacity
            style={styles.syncBtn}
            onPress={refreshState}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Role & Connection Bar */}
      <View style={styles.subBar}>
        <View style={[styles.rolePill, { backgroundColor: role.bg }]}>
          <MaterialCommunityIcons name="shield-account" size={13} color={role.color} />
          <Text style={[styles.roleText, { color: role.color }]}>{role.label}</Text>
        </View>

        <View style={styles.networkStatus}>
          <View style={[styles.netDot, { backgroundColor: isBackendOnline ? '#10B981' : '#F59E0B' }]} />
          <Text style={styles.networkText}>
            {isBackendOnline ? 'Backend Live (3001)' : 'Offline Local Mode'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    ...Shadows.card,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 36,
    height: 36,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  syncBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  netDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  networkText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
