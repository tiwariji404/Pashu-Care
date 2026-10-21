import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function CattleDetailModal({ cow, visible, onClose, onOpenReportModal }) {
  const { language, complaints, payComplaint } = useApp();
  const [paying, setPaying] = useState(false);

  if (!cow) return null;

  const cowComplaints = complaints.filter(c => c.cowQrId === cow.qrId);
  const unpaidComplaint = cowComplaints.find(c => c.status === 'unpaid');

  const handleCallOwner = () => {
    if (cow.phone) {
      Linking.openURL(`tel:${cow.phone}`).catch(() => {
        Alert.alert('Phone Dial', `Calling ${cow.ownerName}: ${cow.phone}`);
      });
    }
  };

  const handlePay = async (complaintId) => {
    setPaying(true);
    await payComplaint(complaintId);
    setPaying(false);
    Alert.alert(
      language === 'hi' ? '✅ जुर्माना भुगतान सफल' : '✅ Fine Payment Successful',
      language === 'hi'
        ? 'चालान का सफलतापूर्वक निस्तारण कर दिया गया है।'
        : 'Penalty resolved. Revenue recorded in municipal fund.'
    );
  };

  const getStrikeBadge = () => {
    if (cow.seized || cow.strikes >= 3) {
      return {
        label: language === 'hi' ? '🚨 पशु जब्त (Seized)' : '🚨 Animal Seized (Strike 3)',
        bg: '#FEE2E2',
        color: '#DC2626',
        desc: language === 'hi' ? '3 स्ट्राइक पूर्ण: पशु को गौशाला में जब्त किया गया है' : 'Seized by Municipal Squad',
      };
    }
    if (cow.strikes === 2) {
      return {
        label: language === 'hi' ? '⚠️ 2 स्ट्राइक (₹3,000 जुर्माना)' : '⚠️ Strike 2 (₹3,000 Penalty)',
        bg: '#FEF3C7',
        color: '#D97706',
        desc: language === 'hi' ? 'अंतिम चेतावनी: अगली बार पशु जब्त कर लिया जाएगा' : 'Final Warning before seizure',
      };
    }
    if (cow.strikes === 1) {
      return {
        label: language === 'hi' ? '⚠️ 1 स्ट्राइक (₹1,000 जुर्माना)' : '⚠️ Strike 1 (₹1,000 Penalty)',
        bg: '#FEF3C7',
        color: '#D97706',
        desc: language === 'hi' ? 'पहली चेतावनी जारी की गई' : 'First warning issued to owner',
      };
    }
    return {
      label: language === 'hi' ? '✅ स्वच्छ रिकॉर्ड (0 स्ट्राइक)' : '✅ Clean Record (0 Strikes)',
      bg: '#ECFDF5',
      color: '#059669',
      desc: language === 'hi' ? 'कोई सड़क उल्लंघन नहीं' : 'No violations recorded',
    };
  };

  const strikeInfo = getStrikeBadge();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.tagBadge}>
                <Ionicons name="pricetag" size={16} color="#FFFFFF" />
                <Text style={styles.tagBadgeText}>#{cow.qrId}</Text>
              </View>
              <View>
                <Text style={styles.cowTitle}>{cow.breed}</Text>
                <Text style={styles.cowSubtitle}>{cow.species} • {cow.age} {language === 'hi' ? 'वर्ष' : 'Years'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Strike & Seizure Card */}
            <View style={[styles.strikeCard, { backgroundColor: strikeInfo.bg }]}>
              <View style={styles.strikeRow}>
                <Text style={[styles.strikeTitle, { color: strikeInfo.color }]}>
                  {strikeInfo.label}
                </Text>
                <View style={styles.strikeGauges}>
                  <View style={[styles.gaugeDot, cow.strikes >= 1 && { backgroundColor: '#EF4444' }]} />
                  <View style={[styles.gaugeDot, cow.strikes >= 2 && { backgroundColor: '#EF4444' }]} />
                  <View style={[styles.gaugeDot, cow.strikes >= 3 && { backgroundColor: '#EF4444' }]} />
                </View>
              </View>
              <Text style={[styles.strikeDesc, { color: strikeInfo.color }]}>
                {strikeInfo.desc}
              </Text>
            </View>

            {/* Unpaid Fine Banner if any */}
            {unpaidComplaint && (
              <View style={styles.unpaidFineBanner}>
                <View>
                  <Text style={styles.unpaidFineTitle}>
                    {language === 'hi' ? 'लंबित जुर्माना: ₹' : 'Pending Fine: ₹'}
                    {unpaidComplaint.fine}
                  </Text>
                  <Text style={styles.unpaidFineReason}>{unpaidComplaint.reason}</Text>
                </View>
                <TouchableOpacity
                  style={styles.payBtn}
                  onPress={() => handlePay(unpaidComplaint.id)}
                  disabled={paying}
                >
                  <Text style={styles.payBtnText}>
                    {paying ? '...' : (language === 'hi' ? 'भुगतान करें' : 'Pay Online')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Health & Medical Information */}
            <Text style={styles.sectionTitle}>
              {language === 'hi' ? 'चिकित्सा एवं स्वास्थ्य स्थिति' : 'Medical & Health Profile'}
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="heart-pulse" size={18} color="#10B981" />
                <Text style={styles.infoLabel}>{language === 'hi' ? 'स्वास्थ्य' : 'Health'}</Text>
                <Text style={styles.infoVal}>{cow.health}</Text>
              </View>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="needle" size={18} color="#3B82F6" />
                <Text style={styles.infoLabel}>{language === 'hi' ? 'टीकाकरण' : 'Vaccine Date'}</Text>
                <Text style={styles.infoVal}>{cow.vaccination}</Text>
              </View>
            </View>

            {/* Owner & Farm Details */}
            <Text style={styles.sectionTitle}>
              {language === 'hi' ? 'पशुपालक / डेयरी विवरण' : 'Owner & Dairy Record'}
            </Text>

            <View style={styles.ownerCard}>
              <View style={styles.ownerTop}>
                <View style={styles.ownerAvatar}>
                  <FontAwesome5 name="user" size={18} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ownerName}>{cow.ownerName}</Text>
                  <Text style={styles.ownerPhone}>📞 {cow.phone}</Text>
                </View>
                <TouchableOpacity style={styles.callIconBtn} onPress={handleCallOwner}>
                  <Ionicons name="call" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={15} color="#64748B" />
                <Text style={styles.detailText}>{cow.address}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={15} color="#64748B" />
                <Text style={styles.detailText}>
                  {language === 'hi' ? 'आधार नंबर: ' : 'Aadhar: '}
                  •••• •••• {cow.aadhar?.slice(-4) || '1234'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.reportStrayBtn}
                onPress={() => {
                  onClose();
                  if (onOpenReportModal) onOpenReportModal(cow.qrId);
                }}
              >
                <Ionicons name="warning-outline" size={18} color="#FFFFFF" />
                <Text style={styles.reportStrayBtnText}>
                  {language === 'hi' ? 'उल्लंघन दर्ज करें (Issue Strike)' : 'Report Violation / Fine'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 28,
    maxHeight: '90%',
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cowTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  cowSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  strikeCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  strikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  strikeTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  strikeGauges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gaugeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
  },
  strikeDesc: {
    fontSize: 11,
    fontWeight: '500',
  },
  unpaidFineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  unpaidFineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
  },
  unpaidFineReason: {
    fontSize: 11,
    color: '#7F1D1D',
  },
  payBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  payBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  ownerCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  ownerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  ownerPhone: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  callIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#475569',
  },
  actionButtons: {
    marginTop: 4,
  },
  reportStrayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    paddingVertical: 13,
    borderRadius: 12,
  },
  reportStrayBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
