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

export default function ReportMissingModal({ visible, onClose }) {
  const { language, reportMissing } = useApp();

  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Ward 2, Garhwa');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('₹2,000 इनाम');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!ownerName.trim() || !phone.trim() || !description.trim()) {
      Alert.alert(
        language === 'hi' ? 'अधूरी जानकारी' : 'Incomplete Form',
        language === 'hi' ? 'कृपया पशु का विवरण और अपना फोन नंबर दर्ज करें।' : 'Please fill all required fields.'
      );
      return;
    }

    setSubmitting(true);
    await reportMissing({
      ownerName,
      reporterPhone: phone,
      location,
      description,
      reward,
    });
    setSubmitting(false);

    Alert.alert(
      language === 'hi' ? '📢 लापता पशु सूचना प्रकाशित' : '📢 Missing Report Published',
      language === 'hi'
        ? 'आपके पशु की सूचना पूरे शहर के नागरिकों और गश्ती दलों को प्रसारित कर दी गई है।'
        : 'Missing livestock alert has been broadcasted to city feed and patrol squad.'
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
                <Ionicons name="search" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>
                  {language === 'hi' ? 'लापता पशु की सूचना दें' : 'Report Missing Cattle'}
                </Text>
                <Text style={styles.subtitle}>
                  {language === 'hi' ? 'सामुदायिक खोज एवं इनाम' : 'Community Broadcast & Search'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Text style={styles.sectionLabel}>{language === 'hi' ? 'पशुपालक का नाम:' : 'Owner Name:'}</Text>
            <TextInput
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder="e.g. Ramesh Singh"
            />

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'संपर्क फोन नंबर:' : 'Contact Phone:'}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="9876543210"
            />

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'अंतिम बार कहां देखा गया (Last Seen):' : 'Last Seen Location:'}</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Near Shiv Mandir, Ward 4"
            />

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'पशु का हुलिया / पहचान चिन्ह:' : 'Description / Identification:'}</Text>
            <TextInput
              style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder={language === 'hi' ? 'नस्ल, रंग, सींग का आकार, गले का पट्टा या टैग...' : 'Breed, color, horns, collar or ear tag...'}
              multiline
            />

            <Text style={styles.sectionLabel}>{language === 'hi' ? 'इनाम राशि (Reward):' : 'Reward (Optional):'}</Text>
            <TextInput
              style={styles.input}
              value={reward}
              onChangeText={setReward}
              placeholder="e.g. ₹2,000 Reward"
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
                  <Ionicons name="megaphone" size={18} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>
                    {language === 'hi' ? 'लापता पशु अलर्ट जारी करें' : 'PUBLISH MISSING NOTICE'}
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
    backgroundColor: '#3B82F6',
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
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
