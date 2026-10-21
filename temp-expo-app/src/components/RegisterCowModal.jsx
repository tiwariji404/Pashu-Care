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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function RegisterCowModal({ visible, onClose, initialQrId }) {
  const { language, registerCow } = useApp();

  const [qrId, setQrId] = useState(initialQrId || `TAG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [breed, setBreed] = useState('Gir (गिर)');
  const [species, setSpecies] = useState('Cow');
  const [age, setAge] = useState('4');
  const [health, setHealth] = useState('Healthy / स्वस्थ');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const BREED_OPTIONS = ['Gir (गिर)', 'Sahiwal (साहीवाल)', 'Tharparkar (थारपारकर)', 'Rathi (राठी)', 'Red Sindhi', 'Desi Local'];

  const handleRegister = async () => {
    if (!ownerName.trim() || !phone.trim()) {
      Alert.alert(
        language === 'hi' ? 'अधूरी जानकारी' : 'Missing Information',
        language === 'hi' ? 'कृपया पशुपालक का नाम और फोन नंबर दर्ज करें।' : 'Please enter owner name and contact number.'
      );
      return;
    }

    setSubmitting(true);
    await registerCow({
      qrId,
      species,
      breed,
      age: Number(age) || 3,
      health,
      ownerName,
      phone,
      aadhar: aadhar || '987654321000',
      address: address || 'Local Farm, Garhwa',
    });
    setSubmitting(false);

    Alert.alert(
      language === 'hi' ? '✅ पशु सफलतापूर्वक पंजीकृत!' : '✅ Cattle Tagged Successfully!',
      language === 'hi'
        ? `टैग ID #${qrId} को डेटाबेस में सक्रिय कर दिया गया है।`
        : `Ear Tag #${qrId} has been linked to ${ownerName}.`
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.tagIcon}>
                <Ionicons name="pricetag" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>
                  {language === 'hi' ? 'नया पशु टैगिंग पंजीकरण' : 'Register & Tag Cattle'}
                </Text>
                <Text style={styles.subtitle}>
                  {language === 'hi' ? 'RFID / QR कान टैग आवंटन' : 'Assign RFID / Ear Tag to Livestock'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Tag ID Display */}
            <View style={styles.tagIdCard}>
              <Text style={styles.tagIdLabel}>
                {language === 'hi' ? 'कान का टैग नंबर (Ear Tag ID):' : 'Cattle Ear Tag ID:'}
              </Text>
              <TextInput
                style={styles.tagIdInput}
                value={qrId}
                onChangeText={setQrId}
                placeholder="e.g. TAG-402"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Breed Selector */}
            <Text style={styles.sectionLabel}>
              {language === 'hi' ? 'पशु नस्ल चुनें (Select Breed):' : 'Select Breed:'}
            </Text>
            <View style={styles.chipsRow}>
              {BREED_OPTIONS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.chip, breed === b && styles.chipActive]}
                  onPress={() => setBreed(b)}
                >
                  <Text style={[styles.chipText, breed === b && styles.chipTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Age & Species */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>{language === 'hi' ? 'आयु (वर्ष):' : 'Age (Years):'}</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="e.g. 4"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>{language === 'hi' ? 'स्वास्थ्य:' : 'Health:'}</Text>
                <TextInput
                  style={styles.input}
                  value={health}
                  onChangeText={setHealth}
                  placeholder="Healthy / सामान्य"
                />
              </View>
            </View>

            {/* Owner Details */}
            <Text style={styles.sectionLabel}>
              {language === 'hi' ? 'पशुपालक का नाम (Owner Name):' : 'Owner Name:'}
            </Text>
            <TextInput
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder={language === 'hi' ? 'उदा. रामेश्वर सिंह' : 'e.g. Rameshwar Singh'}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>{language === 'hi' ? 'फोन नंबर:' : 'Phone No:'}</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="9876543210"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>{language === 'hi' ? 'आधार कार्ड:' : 'Aadhar:'}</Text>
                <TextInput
                  style={styles.input}
                  value={aadhar}
                  onChangeText={setAadhar}
                  keyboardType="numeric"
                  placeholder="12 अंक आधार"
                />
              </View>
            </View>

            <Text style={styles.sectionLabel}>
              {language === 'hi' ? 'डेयरी या खेत का पता:' : 'Dairy / Farm Address:'}
            </Text>
            <TextInput
              style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
              value={address}
              onChangeText={setAddress}
              placeholder={language === 'hi' ? 'वार्ड नंबर, गांव, लैंडमार्क' : 'Ward No, Village, Landmark'}
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.8 }]}
              onPress={handleRegister}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>
                    {language === 'hi' ? 'पशु टैग सक्रिय करें (Save & Activate Tag)' : 'ACTIVATE RFID TAG'}
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
  tagIcon: {
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
  tagIdCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  tagIdLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  tagIdInput: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
    padding: 0,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
    marginBottom: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  chipActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  chipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
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
    marginTop: 12,
    ...Shadows.float,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
