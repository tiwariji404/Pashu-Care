import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Shadows, Spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import EmergencySOSModal from '../../components/EmergencySOSModal';
import CattleDetailModal from '../../components/CattleDetailModal';
import ReportStrayModal from '../../components/ReportStrayModal';

export default function HomeScreen() {
  const router = useRouter();
  const {
    t,
    language,
    cows,
    complaints,
    revenue,
    missingReports,
    diseaseAlerts,
    refreshState,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedCow, setSelectedCow] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshState();
    setRefreshing(false);
  };

  const totalCattle = cows.length;
  const seizedCount = cows.filter(c => c.seized || c.strikes >= 3).length;
  const missingCount = missingReports.length;
  const totalRevenue = revenue.total;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
      >
        {/* Emergency SOS Hero Card */}
        <TouchableOpacity
          style={styles.sosCard}
          onPress={() => setSosModalVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.sosLeft}>
            <View style={styles.sosPulseIcon}>
              <Ionicons name="alert" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.sosBadgeRow}>
                <Text style={styles.sosTitle}>{t('emergency_sos')}</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>24x7 LIVE</Text>
                </View>
              </View>
              <Text style={styles.sosDesc}>{t('sos_desc')}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Live KPI Statistics Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="cow" size={20} color="#059669" />
            </View>
            <Text style={styles.kpiValue}>{totalCattle}</Text>
            <Text style={styles.kpiLabel}>{t('total_cattle')}</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: '#FEF2F2' }]}>
              <MaterialCommunityIcons name="shield-alert" size={20} color="#DC2626" />
            </View>
            <Text style={[styles.kpiValue, { color: '#DC2626' }]}>{seizedCount}</Text>
            <Text style={styles.kpiLabel}>{language === 'hi' ? 'जब्त पशु' : 'Seized Cattle'}</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="cash-outline" size={20} color="#D97706" />
            </View>
            <Text style={[styles.kpiValue, { color: '#D97706' }]}>₹{totalRevenue}</Text>
            <Text style={styles.kpiLabel}>{t('total_revenue')}</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="search-outline" size={20} color="#2563EB" />
            </View>
            <Text style={[styles.kpiValue, { color: '#2563EB' }]}>{missingCount}</Text>
            <Text style={styles.kpiLabel}>{t('missing_count')}</Text>
          </View>
        </View>

        {/* Quick Action Matrix */}
        <Text style={styles.sectionHeading}>
          {language === 'hi' ? 'त्वरित कार्य (Quick Actions)' : 'Quick Services'}
        </Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/(tabs)/scanner')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="qr-code" size={22} color="#059669" />
            </View>
            <Text style={styles.actionItemTitle}>{language === 'hi' ? 'टैग स्कैन' : 'Scan Tag'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setReportModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF2F2' }]}>
              <MaterialCommunityIcons name="car-traction-control" size={22} color="#DC2626" />
            </View>
            <Text style={styles.actionItemTitle}>{language === 'hi' ? 'आवारा पशु' : 'Report Stray'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/(tabs)/care')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <FontAwesome5 name="hospital-alt" size={20} color="#2563EB" />
            </View>
            <Text style={styles.actionItemTitle}>{language === 'hi' ? 'गौशाला' : 'Gaushala'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/(tabs)/care')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FAF5FF' }]}>
              <FontAwesome5 name="user-md" size={20} color="#7C3AED" />
            </View>
            <Text style={styles.actionItemTitle}>{language === 'hi' ? 'चिकित्सक' : 'Vet Doctors'}</Text>
          </TouchableOpacity>
        </View>

        {/* Active Disease Outbreak Banner */}
        {diseaseAlerts.length > 0 && (
          <View style={styles.alertBanner}>
            <View style={styles.alertHeader}>
              <View style={styles.alertIconCircle}>
                <Ionicons name="warning" size={16} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>{diseaseAlerts[0].disease}</Text>
                <Text style={styles.alertMeta}>📍 {diseaseAlerts[0].location} • {diseaseAlerts[0].date}</Text>
              </View>
            </View>
            <Text style={styles.alertDesc}>{diseaseAlerts[0].description}</Text>
          </View>
        )}

        {/* Recent Registered Cattle Showcase */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            {language === 'hi' ? 'पंजीकृत गौवंश (Cattle Directory)' : 'Registered Livestock'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/scanner')}>
            <Text style={styles.viewAllText}>{language === 'hi' ? 'सभी देखें →' : 'View All →'}</Text>
          </TouchableOpacity>
        </View>

        {cows.slice(0, 3).map((cow) => (
          <TouchableOpacity
            key={cow.qrId}
            style={styles.cowCard}
            onPress={() => setSelectedCow(cow)}
            activeOpacity={0.75}
          >
            <View style={styles.cowCardLeft}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>#{cow.qrId}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cowBreed}>{cow.breed}</Text>
                <Text style={styles.cowOwner}>👤 {cow.ownerName} • {cow.health}</Text>
              </View>
            </View>

            <View style={styles.cowCardRight}>
              <View
                style={[
                  styles.strikeIndicator,
                  { backgroundColor: cow.strikes > 0 ? '#FEE2E2' : '#ECFDF5' },
                ]}
              >
                <Text
                  style={[
                    styles.strikeIndicatorText,
                    { color: cow.strikes > 0 ? '#DC2626' : '#059669' },
                  ]}
                >
                  {cow.strikes > 0 ? `${cow.strikes} Strike` : 'Clean'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Recent Violations / Fines Feed */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionHeading}>
            {language === 'hi' ? 'हालिया गश्ती चालान (Recent Tickets)' : 'Recent Patrol Reports'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/patrol')}>
            <Text style={styles.viewAllText}>{language === 'hi' ? 'चालान सूची →' : 'All Tickets →'}</Text>
          </TouchableOpacity>
        </View>

        {complaints.slice(0, 2).map((cmp) => (
          <View key={cmp.id} style={styles.ticketCard}>
            <View style={styles.ticketTop}>
              <View style={styles.ticketTagPill}>
                <Text style={styles.ticketTagText}>Tag #{cmp.cowQrId}</Text>
              </View>
              <View
                style={[
                  styles.ticketStatusPill,
                  { backgroundColor: cmp.status === 'paid' ? '#ECFDF5' : '#FEF2F2' },
                ]}
              >
                <Text
                  style={[
                    styles.ticketStatusText,
                    { color: cmp.status === 'paid' ? '#059669' : '#DC2626' },
                  ]}
                >
                  {cmp.status === 'paid' ? 'Paid / चुकता' : `Fine ₹${cmp.fine}`}
                </Text>
              </View>
            </View>
            <Text style={styles.ticketReason}>{cmp.reason}</Text>
            <Text style={styles.ticketLandmark}>📍 {cmp.landmark || 'Main Road'}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modals */}
      <EmergencySOSModal visible={sosModalVisible} onClose={() => setSosModalVisible(false)} />
      <ReportStrayModal visible={reportModalVisible} onClose={() => setReportModalVisible(false)} />
      <CattleDetailModal
        cow={selectedCow}
        visible={!!selectedCow}
        onClose={() => setSelectedCow(null)}
        onOpenReportModal={() => setReportModalVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 28,
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    ...Shadows.sos,
  },
  sosLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sosPulseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
  },
  sosDesc: {
    fontSize: 12,
    color: '#FEE2E2',
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  kpiIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginHorizontal: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionItemTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  alertBanner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  alertIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  alertMeta: {
    fontSize: 11,
    color: '#B45309',
  },
  alertDesc: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
    marginTop: 4,
  },
  cowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  cowCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  tagBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cowBreed: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cowOwner: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cowCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strikeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  strikeIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ticketTagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ticketTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  ticketStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ticketStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  ticketReason: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
  ticketLandmark: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
