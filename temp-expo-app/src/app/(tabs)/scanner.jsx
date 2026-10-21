import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Shadows, Spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import CattleDetailModal from '../../components/CattleDetailModal';
import RegisterCowModal from '../../components/RegisterCowModal';
import ReportStrayModal from '../../components/ReportStrayModal';

export default function ScannerScreen() {
  const { language, cows } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCow, setSelectedCow] = useState(null);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [activeTabQr, setActiveTabQr] = useState('');
  const [scanning, setScanning] = useState(false);

  const filteredCows = cows.filter(
    c =>
      c.qrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSimulateScan = (tagId) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const match = cows.find(c => c.qrId === tagId);
      if (match) {
        setSelectedCow(match);
      } else {
        setActiveTabQr(tagId);
        Alert.alert(
          language === 'hi' ? 'नया टैग पाया गया' : 'Unregistered Tag Scanned',
          language === 'hi'
            ? `टैग #${tagId} डेटाबेस में मौजूद नहीं है। क्या आप इसे पंजीकृत करना चाहते हैं?`
            : `Tag #${tagId} not found in database. Would you like to register new cattle?`,
          [
            { text: language === 'hi' ? 'रद्द करें' : 'Cancel', style: 'cancel' },
            {
              text: language === 'hi' ? 'पंजीकरण करें' : 'Register Now',
              onPress: () => setRegisterModalVisible(true),
            },
          ]
        );
      }
    }, 800);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Scanner Viewfinder Box */}
        <View style={styles.scannerBox}>
          <View style={styles.viewfinder}>
            {/* Viewfinder Corners */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Laser Line */}
            <View style={styles.laserLine} />

            <MaterialCommunityIcons name="qrcode-scan" size={48} color="#10B981" />
            <Text style={styles.viewfinderText}>
              {scanning
                ? (language === 'hi' ? 'स्कैनिंग जारी है...' : 'Scanning Ear Tag...')
                : (language === 'hi' ? 'पशु के कान का QR/RFID टैग फ्रेम में रखें' : 'Align Livestock Ear Tag in Viewfinder')}
            </Text>
          </View>

          {/* Quick Demo Tag Simulator Pills */}
          <View style={styles.demoTagsContainer}>
            <Text style={styles.demoTagLabel}>
              {language === 'hi' ? 'त्वरित डेमो टैग टेस्ट:' : 'Quick Tag Test:'}
            </Text>
            <View style={styles.demoTagsRow}>
              {['00', 'TAG-101', 'TAG-205'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={styles.demoTagBtn}
                  onPress={() => handleSimulateScan(t)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="scan" size={13} color="#059669" />
                  <Text style={styles.demoTagBtnText}>Tag #{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Manual Tag Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              language === 'hi'
                ? 'टैग ID, नस्ल या पशुपालक खोजें...'
                : 'Search Tag ID, Breed or Owner...'
            }
            placeholderTextColor="#94A3B8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Register New Cattle Button */}
        <TouchableOpacity
          style={styles.registerNewBtn}
          onPress={() => {
            setActiveTabQr(`TAG-${Math.floor(1000 + Math.random() * 9000)}`);
            setRegisterModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.registerNewBtnText}>
            {language === 'hi' ? 'नया पशु पंजीकृत करें (Tag New Cattle)' : 'Register & Tag New Livestock'}
          </Text>
        </TouchableOpacity>

        {/* Cattle Search / Filter List */}
        <Text style={styles.listHeading}>
          {language === 'hi' ? `पंजीकृत पशु सूची (${filteredCows.length})` : `Tagged Livestock (${filteredCows.length})`}
        </Text>

        {filteredCows.map((cow) => (
          <TouchableOpacity
            key={cow.qrId}
            style={styles.cattleCard}
            onPress={() => setSelectedCow(cow)}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeader}>
              <View style={styles.tagPill}>
                <Ionicons name="pricetag" size={13} color="#FFFFFF" />
                <Text style={styles.tagPillText}>#{cow.qrId}</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: cow.strikes > 0 ? '#FEE2E2' : '#ECFDF5' },
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    { color: cow.strikes > 0 ? '#DC2626' : '#059669' },
                  ]}
                >
                  {cow.strikes > 0 ? `Strike ${cow.strikes}` : 'Healthy'}
                </Text>
              </View>
            </View>

            <Text style={styles.breedName}>{cow.breed} ({cow.species})</Text>
            <Text style={styles.ownerText}>👤 {cow.ownerName} • 📞 {cow.phone}</Text>
            <Text style={styles.addressText}>📍 {cow.address}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.vaccineDate}>💉 Vaccine: {cow.vaccination}</Text>
              <Text style={styles.viewProfileText}>
                {language === 'hi' ? 'विवरण देखें →' : 'View Details →'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modals */}
      <CattleDetailModal
        cow={selectedCow}
        visible={!!selectedCow}
        onClose={() => setSelectedCow(null)}
        onOpenReportModal={() => setReportModalVisible(true)}
      />
      <RegisterCowModal
        visible={registerModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        initialQrId={activeTabQr}
      />
      <ReportStrayModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        prefilledQrId={selectedCow?.qrId}
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
  scannerBox: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    ...Shadows.card,
  },
  viewfinder: {
    width: '100%',
    height: 160,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#10B981',
  },
  cornerTL: { top: 10, left: 10, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 10, right: 10, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 10, left: 10, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 10, right: 10, borderBottomWidth: 3, borderRightWidth: 3 },
  laserLine: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  viewfinderText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 10,
    textAlign: 'center',
  },
  demoTagsContainer: {
    marginTop: 12,
    width: '100%',
  },
  demoTagLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  demoTagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoTagBtnText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    ...Shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  registerNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    ...Shadows.float,
  },
  registerNewBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  cattleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  breedName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  ownerText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  addressText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  vaccineDate: {
    fontSize: 11,
    color: '#64748B',
  },
  viewProfileText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
});
