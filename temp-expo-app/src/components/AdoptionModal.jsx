import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function AdoptionModal({ visible, onClose, animal }) {
  const { language, requestAdoption } = useApp();

  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reason, setReason] = useState('गोपालक सेवा एवं संरक्षण (Dairy & Seva)');
  const [submitting, setSubmitting] = useState(false);

  if (!animal) return null;

  const handleSubmit = async () => {
    if (!applicantName.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    await requestAdoption(animal.id, {
      applicantName,
      phone,
      address,
      reason,
      date: new Date().toISOString(),
    });
    setSubmitting(false);

    Alert.alert(
      language === 'hi' ? '🙏 गोद लेने का आवेदन स्वीकृत' : '🙏 Adoption Request Sent',
      language === 'hi'
        ? `${animal.breed} के लिए आपका आवेदन गौशाला प्रबंधन को भेज दिया गया है। वे सत्यापन हेतु संपर्क करेंगे।`
        : `Your application to adopt ${animal.breed} has been submitted to Gaushala staff.`
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
                <Ionicons name="heart" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>
                  {language === 'hi' ? 'गौवंश गोद लें (Cattle Adoption)' : 'Adopt Rescued Cattle'}
                </Text>
                <Text style={styles.subtitle}>
                  {animal.breed} • {animal.age} {language === 'hi' ? 'वर्ष' : 'Yr'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🐄 {animal.breed}</Text>
              <Text style={styles.infoBoxDesc}>{animal.description}</Text>
            </View>

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'आपका नाम (Applicant Name):' : 'Full Name:'}</Text>
            <TextInput
              style={styles.input}
              value={applicantName}
              onChangeText={setApplicantName}
              placeholder="e.g. Ramesh Kumar"
            />

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'संपर्क फोन नंबर:' : 'Phone Number:'}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="9876543210"
            />

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'निवास / फार्म का पता:' : 'Farm / Residence Address:'}</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. Village Govindpur, Garhwa"
            />

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'गोद लेने का उद्देश्य:' : 'Purpose / Facility Available:'}</Text>
            <TextInput
              style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
              value={reason}
              onChangeText={setReason}
              multiline
            />

            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.8 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="heart" size={18} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>
                    {language === 'hi' ? 'गोद लेने हेतु आवेदन करें' : 'SUBMIT ADOPTION REQUEST'}
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
    backgroundColor: '#10B981',
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
  infoBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  infoBoxDesc: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    ...Shadows.float,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
