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

const EMERGENCY_TYPES = [
  { id: 'injured', labelHi: 'सड़क दुर्घटना में घायल पशु', labelEn: 'Injured Animal on Road', icon: 'ambulance', color: '#EF4444' },
  { id: 'disease', labelHi: 'लंपी / गंभीर बीमारी का प्रकोप', labelEn: 'Disease Outbreak (LSD/FMD)', icon: 'virus', color: '#F59E0B' },
  { id: 'trapped', labelHi: 'नाले या गड्ढे में फंसा पशु', labelEn: 'Cattle Trapped in Drain/Pit', icon: 'life-ring', color: '#3B82F6' },
  { id: 'abandoned', labelHi: 'लावारिस नवजात बछड़ा / पशु', labelEn: 'Abandoned Cattle or Calf', icon: 'heart', color: '#10B981' },
];

export default function EmergencySOSModal({ visible, onClose }) {
  const { language, triggerSOS } = useApp();
  const [selectedType, setSelectedType] = useState('injured');
  const [location, setLocation] = useState('Clock Tower Chowk, Main Highway (GPS: 24.0384° N, 83.8117° E)');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await triggerSOS({
      type: selectedType,
      location,
      description: notes || 'Immediate rescue squad needed',
    });
    setSubmitting(false);
    setDispatched(true);

    setTimeout(() => {
      setDispatched(false);
      onClose();
      Alert.alert(
        language === 'hi' ? '🚨 SOS अलर्ट जारी!' : '🚨 SOS Alert Dispatched!',
        language === 'hi'
          ? 'निकटतम पशु एम्बुलेंस एवं सरकारी पशु चिकित्सक को सूचना भेज दी गई है।'
          : 'Nearest Animal Ambulance & Duty Vet have been dispatched to the location.'
      );
    }, 1800);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.sosIconContainer}>
                <Ionicons name="warning" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>
                  {language === 'hi' ? 'आपातकालीन SOS रिपोर्ट' : 'Emergency Cattle SOS'}
                </Text>
                <Text style={styles.subtitle}>
                  {language === 'hi' ? 'तुरंत राहत व रेस्क्यू टीम' : 'Instant Rescue & Vet Dispatch'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {dispatched ? (
            <View style={styles.dispatchedView}>
              <View style={styles.dispatchCheck}>
                <Ionicons name="checkmark" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.dispatchTitle}>
                {language === 'hi' ? 'रेस्क्यू टीम रवाना!' : 'Rescue Team Dispatched!'}
              </Text>
              <Text style={styles.dispatchDesc}>
                {language === 'hi'
                  ? 'पशु एम्बुलेंस (वाहन #JH-14-5001) आपके स्थान की ओर अग्रसर है।'
                  : 'Ambulance vehicle (JH-14-5001) is en route to GPS coordinates.'}
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              {/* Emergency Type Selector */}
              <Text style={styles.sectionLabel}>
                {language === 'hi' ? '1. आपात स्थिति का प्रकार चुनें:' : '1. Select Emergency Type:'}
              </Text>

              <View style={styles.typesGrid}>
                {EMERGENCY_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeCard,
                        isSelected && { borderColor: type.color, backgroundColor: `${type.color}10` },
                      ]}
                      onPress={() => setSelectedType(type.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.typeIcon, { backgroundColor: `${type.color}20` }]}>
                        <FontAwesome5 name={type.icon} size={16} color={type.color} />
                      </View>
                      <Text style={[styles.typeText, isSelected && { color: type.color, fontWeight: '700' }]}>
                        {language === 'hi' ? type.labelHi : type.labelEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Location Input */}
              <Text style={styles.sectionLabel}>
                {language === 'hi' ? '2. घटना स्थल (GPS लोकेशन):' : '2. Incident Location (GPS):'}
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={18} color="#EF4444" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder={language === 'hi' ? 'सड़क / लैंडमार्क लिखें' : 'Enter street or landmark'}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Additional Notes */}
              <Text style={styles.sectionLabel}>
                {language === 'hi' ? '3. अतिरिक्त विवरण या पहचान चिन्ह:' : '3. Additional Notes / Signs:'}
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder={
                  language === 'hi'
                    ? 'उदा. गाय का दाहिना पैर चोटिल है, कान में पीला टैग लगा है...'
                    : 'e.g. Cow bleeding from right leg, yellow ear tag visible...'
                }
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />

              {/* Warning note */}
              <View style={styles.infoBanner}>
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
                <Text style={styles.infoText}>
                  {language === 'hi'
                    ? 'SOS अलर्ट सीधे निकटतम नगर निगम गश्ती दल और पशु चिकित्सालय को प्रेषित होता है।'
                    : 'SOS is directly broadcasted to the nearest Vet Emergency Squad & Shelter.'}
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.sosButton, submitting && { opacity: 0.8 }]}
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.8}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="flash" size={20} color="#FFFFFF" />
                    <Text style={styles.sosButtonText}>
                      {language === 'hi' ? 'आपातकालीन राहत भेजें (SOS Dispatch)' : 'DISPATCH EMERGENCY RESCUE'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
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
    ...Shadows.sos,
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
  sosIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontWeight: '500',
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
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 8,
  },
  typesGrid: {
    gap: 8,
    marginBottom: 8,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    height: 70,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 14,
    ...Shadows.sos,
  },
  sosButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  dispatchedView: {
    alignItems: 'center',
    padding: 32,
  },
  dispatchCheck: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Shadows.float,
  },
  dispatchTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  dispatchDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
