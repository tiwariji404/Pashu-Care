import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function ReportStrayModal({ visible, onClose, prefilledQrId }) {
  const { language, cows, reportComplaint } = useApp();

  const [cowQrId, setCowQrId] = useState(prefilledQrId || '00');
  const [reason, setReason] = useState('सड़क पर विचरण व यातायात बाधा (Stray on Main Highway)');
  const [landmark, setLandmark] = useState('Court Road, Garhwa Main Circle');
  const [issueFine, setIssueFine] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const matchedCow = cows.find(c => c.qrId === cowQrId);
  const currentStrikes = matchedCow?.strikes || 0;
  const nextStrike = currentStrikes + (issueFine ? 1 : 0);

  const calculateFine = () => {
    if (!issueFine) return 0;
    if (nextStrike === 1) return 1000;
    if (nextStrike === 2) return 3000;
    if (nextStrike >= 3) return 5000;
    return 0;
  };

  const fineAmount = calculateFine();

  const handleSubmit = async () => {
    if (!cowQrId.trim()) {
      Alert.alert('Error', 'Please enter or select cattle Ear Tag ID');
      return;
    }

    setSubmitting(true);
    await reportComplaint({
      cowQrId,
      reason,
      landmark,
      issueFine,
      location: { lat: 24.0384, lng: 83.8117 },
    });
    setSubmitting(false);

    Alert.alert(
      language === 'hi' ? '🚨 उल्लंघन दर्ज' : '🚨 Violation Recorded',
      language === 'hi'
        ? `टैग #${cowQrId} के पशुपालक को स्ट्राइक ${nextStrike} का SMS चालान (₹${fineAmount}) भेज दिया गया है।`
        : `Strike ${nextStrike} fine of ₹${fineAmount} logged. SMS sent to owner.`
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>
                  {language === 'hi' ? 'आवारा पशु / उल्लंघन चालान' : 'Report Stray Cattle Violation'}
                </Text>
                <Text style={styles.subtitle}>
                  {language === 'hi' ? 'गश्ती दल एवं नागरिक रिपोर्ट' : 'Patrol Squad Action & Penalty'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Tag ID selection */}
            <Text style={styles.sectionLabel}>
              {language === 'hi' ? '1. पशु का कान टैग नंबर (Ear Tag):' : '1. Ear Tag ID:'}
            </Text>
            <TextInput
              style={styles.input}
              value={cowQrId}
              onChangeText={setCowQrId}
              placeholder="e.g. 00, TAG-101"
            />

            {/* Matched Cow Preview */}
            {matchedCow ? (
              <View style={styles.cowMatchCard}>
                <View style={styles.cowMatchRow}>
                  <Text style={styles.cowMatchTitle}>🏷️ {matchedCow.breed} ({matchedCow.species})</Text>
                  <Text style={styles.cowMatchStrikes}>
                    {language === 'hi' ? `वर्तमान स्ट्राइक: ${currentStrikes}/3` : `Current Strikes: ${currentStrikes}/3`}
                  </Text>
                </View>
                <Text style={styles.cowMatchOwner}>
                  👤 {matchedCow.ownerName} • 📞 {matchedCow.phone}
                </Text>
              </View>
            ) : (
              <Text style={styles.tagHint}>
                {language === 'hi' ? '💡 कान टैग दर्ज करने पर पशुपालक का विवरण स्वतः आ जाएगा।' : 'Enter valid tag to auto-fetch owner details.'}
              </Text>
            )}

            {/* Violation Location */}
            <Text style={styles.sectionLabel}>
              {language === 'hi' ? '2. सड़क / घटना स्थल (Location):' : '2. Violation Location:'}
            </Text>
            <TextInput
              style={styles.input}
              value={landmark}
              onChangeText={setLandmark}
              placeholder="e.g. Near Railway Crossing, Main Highway"
            />

            {/* Reason */}
            <Text style={styles.sectionLabel}>
              {language === 'hi' ? '3. उल्लंघन का कारण:' : '3. Reason / Description:'}
            </Text>
            <TextInput
              style={styles.input}
              value={reason}
              onChangeText={setReason}
              placeholder="e.g. Wandering on traffic lane, garbage dumping"
            />

            {/* Issue Fine & Strike Toggle */}
            <View style={styles.fineToggleCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fineToggleTitle}>
                  {language === 'hi' ? 'जुर्माना व स्ट्राइक जारी करें' : 'Issue Fine & Strike'}
                </Text>
                <Text style={styles.fineToggleSubtitle}>
                  {language === 'hi'
                    ? `स्ट्राइक ${nextStrike} → जुर्माना ₹${fineAmount}${nextStrike >= 3 ? ' (जब्ती आदेश)' : ''}`
                    : `Strike ${nextStrike} → Penalty ₹${fineAmount}${nextStrike >= 3 ? ' (Seizure)' : ''}`}
                </Text>
              </View>
              <Switch
                value={issueFine}
                onValueChange={setIssueFine}
                trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                thumbColor={issueFine ? '#EF4444' : '#F8FAFC'}
              />
            </View>

            {/* SMS Preview */}
            <View style={styles.smsPreview}>
              <Ionicons name="chatbox-ellipses-outline" size={16} color="#4F46E5" />
              <Text style={styles.smsPreviewText}>
                {language === 'hi'
                  ? `[स्वचालित SMS]: "पशुपालक ${matchedCow?.ownerName || 'जी'}, आपका पशु (${matchedCow?.breed || 'गौवंश'}) सड़क पर पाया गया है। चालान ₹${fineAmount} काटा गया है।"`
                  : `[Automated SMS]: "Owner ${matchedCow?.ownerName || ''}, your cattle was spotted stray. Penalty ₹${fineAmount} issued."`}
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.8 }]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>
                    {language === 'hi' ? 'उल्लंघन दर्ज करें एवं SMS भेजें' : 'DISPATCH VIOLATION TICKET'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
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
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
  },
  tagHint: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cowMatchCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  cowMatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cowMatchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  cowMatchStrikes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  cowMatchOwner: {
    fontSize: 12,
    color: '#3B82F6',
  },
  fineToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  fineToggleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  fineToggleSubtitle: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 2,
  },
  smsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 14,
  },
  smsPreviewText: {
    fontSize: 11,
    color: '#3730A3',
    flex: 1,
    lineHeight: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 14,
    ...Shadows.sos,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
