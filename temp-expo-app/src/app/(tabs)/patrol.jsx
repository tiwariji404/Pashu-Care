import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Shadows, Spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import ReportStrayModal from '../../components/ReportStrayModal';
import CattleDetailModal from '../../components/CattleDetailModal';

export default function PatrolScreen() {
  const { language, complaints, cows, payComplaint } = useApp();

  const [activeFilter, setActiveFilter] = useState('all');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedCow, setSelectedCow] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const filteredComplaints = complaints.filter((c) => {
    if (activeFilter === 'unpaid') return c.status === 'unpaid';
    if (activeFilter === 'paid') return c.status === 'paid';
    if (activeFilter === 'seized') return c.status === 'pending_seizure' || c.strikeLevel >= 3;
    return true;
  });

  const handlePay = async (id, fine) => {
    setPayingId(id);
    await payComplaint(id);
    setPayingId(null);
    Alert.alert(
      language === 'hi' ? 'चालान भुगतान सफल' : 'Payment Received',
      language === 'hi' ? `₹${fine} का चालान चुकता कर दिया गया है।` : `Penalty of ₹${fine} recorded as paid.`
    );
  };

  const openCowByTag = (tagId) => {
    const match = cows.find(c => c.qrId === tagId);
    if (match) setSelectedCow(match);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Patrol Squad Header Card */}
        <View style={styles.squadHero}>
          <View style={styles.squadHeroLeft}>
            <View style={styles.squadBadge}>
              <MaterialCommunityIcons name="shield-car" size={24} color="#DC2626" />
            </View>
            <View>
              <Text style={styles.squadTitle}>
                {language === 'hi' ? 'गश्ती दल प्रवर्तन सेल' : 'Patrol Squad Enforcement'}
              </Text>
              <Text style={styles.squadSubtitle}>
                {language === 'hi' ? 'सड़क पर विचरण व चालान मॉनिटरिंग' : 'Stray Livestock Violations & Fines'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.newReportBtn}
            onPress={() => setReportModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.newReportBtnText}>
              {language === 'hi' ? 'नया चालान' : 'New Ticket'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersRow}>
          {[
            { id: 'all', labelHi: 'सभी (All)', labelEn: 'All' },
            { id: 'unpaid', labelHi: 'लंबित (Unpaid)', labelEn: 'Unpaid' },
            { id: 'paid', labelHi: 'चुकता (Paid)', labelEn: 'Paid' },
            { id: 'seized', labelHi: 'जब्त (Seized)', labelEn: 'Seized' },
          ].map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.id)}
            >
              <Text style={[styles.filterText, activeFilter === f.id && styles.filterTextActive]}>
                {language === 'hi' ? f.labelHi : f.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Violation Tickets List */}
        <Text style={styles.listHeading}>
          {language === 'hi'
            ? `उल्लंघन चालान सूची (${filteredComplaints.length})`
            : `Patrol Tickets (${filteredComplaints.length})`}
        </Text>

        {filteredComplaints.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={44} color="#10B981" />
            <Text style={styles.emptyTitle}>
              {language === 'hi' ? 'कोई लंबित मामला नहीं है' : 'No Violations Found'}
            </Text>
            <Text style={styles.emptyDesc}>
              {language === 'hi' ? 'सड़कों पर स्थिति सामान्य एवं सुरक्षित है।' : 'All roads clear of stray cattle.'}
            </Text>
          </View>
        ) : (
          filteredComplaints.map((cmp) => {
            const isPaid = cmp.status === 'paid';
            const isSeized = cmp.status === 'pending_seizure' || cmp.strikeLevel >= 3;

            return (
              <View key={cmp.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <TouchableOpacity
                    style={styles.tagLink}
                    onPress={() => openCowByTag(cmp.cowQrId)}
                  >
                    <Ionicons name="pricetag" size={13} color="#FFFFFF" />
                    <Text style={styles.tagLinkText}>Tag #{cmp.cowQrId}</Text>
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isPaid ? '#ECFDF5' : (isSeized ? '#FEE2E2' : '#FEF3C7'),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        {
                          color: isPaid ? '#059669' : (isSeized ? '#DC2626' : '#D97706'),
                        },
                      ]}
                    >
                      {isPaid ? 'Paid' : (isSeized ? 'Cattle Seized' : `Strike ${cmp.strikeLevel}`)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketReason}>{cmp.reason}</Text>
                <Text style={styles.ticketMeta}>📍 {cmp.landmark || 'Main Road'}</Text>

                {/* Fine & Action Row */}
                <View style={styles.ticketFooter}>
                  <View>
                    <Text style={styles.fineLabel}>{language === 'hi' ? 'जुर्माना राशि:' : 'Fine Amount:'}</Text>
                    <Text style={[styles.fineValue, isPaid && { color: '#059669' }]}>
                      ₹{cmp.fine}
                    </Text>
                  </View>

                  {!isPaid && cmp.fine > 0 && (
                    <TouchableOpacity
                      style={styles.payBtn}
                      onPress={() => handlePay(cmp.id, cmp.fine)}
                      disabled={payingId === cmp.id}
                    >
                      <Text style={styles.payBtnText}>
                        {payingId === cmp.id ? '...' : (language === 'hi' ? 'भुगतान दर्ज करें' : 'Record Payment')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modals */}
      <ReportStrayModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
      />
      <CattleDetailModal
        cow={selectedCow}
        visible={!!selectedCow}
        onClose={() => setSelectedCow(null)}
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
  squadHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  squadHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  squadBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  squadSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  newReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  newReportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  filterText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  ticketReason: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  ticketMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  fineLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  fineValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
  },
  payBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  payBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
