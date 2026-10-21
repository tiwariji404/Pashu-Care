import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Shadows, Spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import ReportMissingModal from '../../components/ReportMissingModal';
import AdoptionModal from '../../components/AdoptionModal';

export default function MoreScreen() {
  const {
    language,
    user,
    switchUserRole,
    missingReports,
    adoptions,
    warehouseInventory,
    allocateInventory,
    isBackendOnline,
    refreshState,
  } = useApp();

  const [activeSection, setActiveSection] = useState('missing');
  const [missingModalVisible, setMissingModalVisible] = useState(false);
  const [selectedAdoption, setSelectedAdoption] = useState(null);

  const handleAllocate = async (amount) => {
    await allocateInventory(user.phone, amount);
    Alert.alert(
      language === 'hi' ? '✅ टैग आवंटित' : '✅ Tags Dispatched',
      language === 'hi'
        ? `${amount} QR/RFID टैग फील्ड एजेंट को आवंटित कर दिए गए हैं।`
        : `Dispatched ${amount} RFID tags from central warehouse.`
    );
  };

  const ROLES = [
    { id: 'admin', labelHi: 'नगर निगम प्रशासक', labelEn: 'Municipal Admin', icon: 'shield-account', color: '#7C3AED' },
    { id: 'patrol_squad', labelHi: 'गश्ती दल (Patrol Squad)', labelEn: 'Patrol Squad', icon: 'car-emergency', color: '#DC2626' },
    { id: 'tagging_agent', labelHi: 'RFID टैगिंग एजेंट', labelEn: 'Tagging Agent', icon: 'tag-multiple', color: '#D97706' },
    { id: 'gaushala_manager', labelHi: 'गौशाला प्रबंधक', labelEn: 'Gaushala Manager', icon: 'home-heart', color: '#4F46E5' },
    { id: 'user', labelHi: 'नागरिक / पशुपालक', labelEn: 'Citizen / Farmer', icon: 'account', color: '#059669' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Navigation Selector */}
        <View style={styles.navRow}>
          {[
            { id: 'missing', labelHi: 'लापता पशु', labelEn: 'Missing', icon: 'search' },
            { id: 'adoption', labelHi: 'गोद लें', labelEn: 'Adopt', icon: 'heart' },
            { id: 'admin', labelHi: 'भूमिका व स्टॉक', labelEn: 'Admin Hub', icon: 'settings' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navBtn, activeSection === tab.id && styles.navBtnActive]}
              onPress={() => setActiveSection(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={activeSection === tab.id ? '#059669' : '#64748B'}
              />
              <Text style={[styles.navBtnText, activeSection === tab.id && styles.navBtnTextActive]}>
                {language === 'hi' ? tab.labelHi : tab.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 1: Missing Cattle Portal */}
        {activeSection === 'missing' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>
                  {language === 'hi' ? 'लापता पशु सूचना पट' : 'Community Missing Livestock'}
                </Text>
                <Text style={styles.sectionSub}>
                  {language === 'hi' ? 'खोए हुए पशुओं की रिपोर्ट और इनाम' : 'Search notices & announce rewards'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => setMissingModalVisible(true)}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>
                  {language === 'hi' ? 'सूचना दें' : 'Report'}
                </Text>
              </TouchableOpacity>
            </View>

            {missingReports.map((item) => (
              <View key={item.id} style={styles.missingCard}>
                <Image source={{ uri: item.photo }} style={styles.missingImage} />
                <View style={styles.missingContent}>
                  <View style={styles.rewardPill}>
                    <Text style={styles.rewardText}>{item.reward || '₹1,500 इनाम'}</Text>
                  </View>
                  <Text style={styles.missingOwner}>👤 {item.ownerName}</Text>
                  <Text style={styles.missingLocation}>📍 {item.location} • {item.timestamp}</Text>
                  <Text style={styles.missingDesc}>{item.description}</Text>
                  <TouchableOpacity
                    style={styles.contactBtn}
                    onPress={() => Alert.alert('Contact Owner', `Call ${item.ownerName}: ${item.reporterPhone}`)}
                  >
                    <Ionicons name="call" size={14} color="#059669" />
                    <Text style={styles.contactBtnText}>
                      {language === 'hi' ? `संपर्क: ${item.reporterPhone}` : `Call: ${item.reporterPhone}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Section 2: Cattle Adoption Portal */}
        {activeSection === 'adoption' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>
                  {language === 'hi' ? 'गौ सेवा / आश्रय गोद लें' : 'Adopt Rescued Livestock'}
                </Text>
                <Text style={styles.sectionSub}>
                  {language === 'hi' ? 'सड़कों से बचाई गई गायों को आश्रय दें' : 'Foster or adopt cattle from shelters'}
                </Text>
              </View>
            </View>

            {adoptions.map((item) => (
              <View key={item.id} style={styles.adoptCard}>
                <Image source={{ uri: item.photo }} style={styles.adoptImage} />
                <View style={styles.adoptContent}>
                  <View style={styles.adoptHeader}>
                    <Text style={styles.adoptBreed}>{item.breed}</Text>
                    <View style={styles.availPill}>
                      <Text style={styles.availText}>
                        {item.status === 'requested' ? 'आवेदन प्रक्रिया में' : 'उपलब्ध (Available)'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.adoptAge}>
                    {item.type} • {item.age} {language === 'hi' ? 'वर्ष आयु' : 'Years old'} • {item.health}
                  </Text>
                  <Text style={styles.adoptDesc}>{item.description}</Text>

                  <TouchableOpacity
                    style={[styles.adoptBtn, item.status === 'requested' && { backgroundColor: '#F1F5F9' }]}
                    onPress={() => setSelectedAdoption(item)}
                    disabled={item.status === 'requested'}
                  >
                    <Ionicons name="heart" size={16} color={item.status === 'requested' ? '#64748B' : '#FFFFFF'} />
                    <Text style={[styles.adoptBtnText, item.status === 'requested' && { color: '#64748B' }]}>
                      {item.status === 'requested'
                        ? (language === 'hi' ? 'आवेदन भेजा गया' : 'Application Sent')
                        : (language === 'hi' ? 'गोद लेने का आवेदन करें' : 'Apply for Adoption')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Section 3: Admin & Roles Switcher */}
        {activeSection === 'admin' && (
          <View>
            {/* Role Switcher */}
            <Text style={styles.sectionHeading}>
              {language === 'hi' ? 'एप्लिकेशन उपयोगकर्ता भूमिका (Switch Role)' : 'Switch User Role'}
            </Text>
            <Text style={styles.sectionSub}>
              {language === 'hi'
                ? 'विभिन्न भूमिकाओं में ऐप की कार्यक्षमता का परीक्षण करें'
                : 'Experience the app from different stakeholder views'}
            </Text>

            <View style={styles.rolesGrid}>
              {ROLES.map((r) => {
                const isActive = user.role === r.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.roleCard, isActive && { borderColor: r.color, backgroundColor: `${r.color}10` }]}
                    onPress={() => switchUserRole(r.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons name={r.icon} size={22} color={r.color} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.roleName, isActive && { color: r.color, fontWeight: '800' }]}>
                        {language === 'hi' ? r.labelHi : r.labelEn}
                      </Text>
                      {isActive && (
                        <Text style={styles.activePillText}>
                          {language === 'hi' ? '● सक्रिय भूमिका' : '● Active View'}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Warehouse Tag Inventory Dispatch */}
            <View style={styles.inventoryCard}>
              <View style={styles.invHeader}>
                <Ionicons name="cube" size={20} color="#059669" />
                <Text style={styles.invTitle}>
                  {language === 'hi' ? 'केंद्रीय वेयरहाउस टैग स्टॉक' : 'Central Warehouse Tag Stock'}
                </Text>
              </View>
              <Text style={styles.invCount}>
                {warehouseInventory.toLocaleString()} {language === 'hi' ? 'QR/RFID टैग उपलब्ध' : 'Tags Available'}
              </Text>
              <Text style={styles.invDesc}>
                {language === 'hi'
                  ? 'फील्ड टैगिंग एजेंटों को नया स्टॉक तुरंत भेजें:'
                  : 'Dispatch new stock to on-field tagging squads:'}
              </Text>

              <View style={styles.dispatchRow}>
                {[50, 100, 200].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={styles.dispatchBtn}
                    onPress={() => handleAllocate(amt)}
                  >
                    <Ionicons name="arrow-forward" size={14} color="#059669" />
                    <Text style={styles.dispatchBtnText}>+{amt} {language === 'hi' ? 'टैग भेजें' : 'Tags'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* System Status & API Diagnostics */}
            <View style={styles.sysCard}>
              <View style={styles.sysRow}>
                <View style={[styles.sysDot, { backgroundColor: isBackendOnline ? '#10B981' : '#F59E0B' }]} />
                <Text style={styles.sysTitle}>
                  {isBackendOnline ? 'Express.js Backend Online (Port 3001)' : 'Offline Local Fallback Active'}
                </Text>
              </View>
              <Text style={styles.sysUrl}>API Base: http://localhost:3001/api</Text>
              <TouchableOpacity style={styles.pingBtn} onPress={refreshState}>
                <Text style={styles.pingBtnText}>
                  {language === 'hi' ? '🔄 सर्वर रीफ्रेश व सिंक' : '🔄 Test Ping & Sync API'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <ReportMissingModal
        visible={missingModalVisible}
        onClose={() => setMissingModalVisible(false)}
      />
      <AdoptionModal
        animal={selectedAdoption}
        visible={!!selectedAdoption}
        onClose={() => setSelectedAdoption(null)}
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
  navRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navBtnActive: {
    backgroundColor: '#ECFDF5',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  navBtnTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  missingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  missingImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E2E8F0',
  },
  missingContent: {
    padding: 14,
  },
  rewardPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  missingOwner: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  missingLocation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  missingDesc: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  adoptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  adoptImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E2E8F0',
  },
  adoptContent: {
    padding: 14,
  },
  adoptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  adoptBreed: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  availPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  availText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  adoptAge: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  adoptDesc: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
    marginBottom: 12,
  },
  adoptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 10,
  },
  adoptBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rolesGrid: {
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  roleName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  activePillText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  inventoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  invHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  invTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  invCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
    marginTop: 4,
  },
  invDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 10,
  },
  dispatchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dispatchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 8,
    borderRadius: 8,
  },
  dispatchBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  sysCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
  },
  sysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sysDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sysTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sysUrl: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 10,
  },
  pingBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  pingBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
});
