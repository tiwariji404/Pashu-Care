import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Shadows, Spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function CareScreen() {
  const { language, gaushalas, vets, ambulances } = useApp();
  const [activeTab, setActiveTab] = useState('gaushalas');

  const makeCall = (name, phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Phone Dial', `Calling ${name}: ${phone}`);
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Category Switcher Tabs */}
        <View style={styles.categoryTabs}>
          <TouchableOpacity
            style={[styles.catTab, activeTab === 'gaushalas' && styles.catTabActive]}
            onPress={() => setActiveTab('gaushalas')}
          >
            <FontAwesome5
              name="hospital-alt"
              size={14}
              color={activeTab === 'gaushalas' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.catTabText, activeTab === 'gaushalas' && styles.catTabTextActive]}>
              {language === 'hi' ? 'गौशाला आश्रय' : 'Gaushalas'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.catTab, activeTab === 'vets' && styles.catTabActive]}
            onPress={() => setActiveTab('vets')}
          >
            <FontAwesome5
              name="user-md"
              size={14}
              color={activeTab === 'vets' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.catTabText, activeTab === 'vets' && styles.catTabTextActive]}>
              {language === 'hi' ? 'पशु चिकित्सक' : 'Vet Doctors'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.catTab, activeTab === 'ambulances' && styles.catTabActive]}
            onPress={() => setActiveTab('ambulances')}
          >
            <FontAwesome5
              name="ambulance"
              size={14}
              color={activeTab === 'ambulances' ? '#059669' : '#64748B'}
            />
            <Text style={[styles.catTabText, activeTab === 'ambulances' && styles.catTabTextActive]}>
              {language === 'hi' ? 'एम्बुलेंस' : 'Ambulance'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Gaushala Directory */}
        {activeTab === 'gaushalas' && (
          <View>
            <Text style={styles.sectionHeading}>
              {language === 'hi'
                ? `पंजीकृत गौशालाएँ (${gaushalas.length})`
                : `Verified Cattle Shelters (${gaushalas.length})`}
            </Text>

            {gaushalas.map((g) => {
              const occupancy = g.currentOccupancy || Math.round(g.capacity * 0.75);
              const percent = Math.min(100, Math.round((occupancy / g.capacity) * 100));

              return (
                <View key={g.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{g.name}</Text>
                      <Text style={styles.cardMeta}>📍 {g.location}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => makeCall(g.name, g.phone)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="call" size={16} color="#FFFFFF" />
                      <Text style={styles.callButtonText}>{language === 'hi' ? 'कॉल करें' : 'Call'}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Occupancy Progress Bar */}
                  <View style={styles.capacityBox}>
                    <View style={styles.capacityLabels}>
                      <Text style={styles.capacityText}>
                        {language === 'hi'
                          ? `वर्तमान क्षमता: ${occupancy} / ${g.capacity} पशु`
                          : `Occupancy: ${occupancy} / ${g.capacity} Cattle`}
                      </Text>
                      <Text style={[styles.capacityPercent, percent > 85 && { color: '#DC2626' }]}>
                        {percent}% Full
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${percent}%`,
                            backgroundColor: percent > 85 ? '#EF4444' : '#10B981',
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Vet Doctors Directory */}
        {activeTab === 'vets' && (
          <View>
            <Text style={styles.sectionHeading}>
              {language === 'hi'
                ? `पशु चिकित्सा विशेषज्ञ (${vets.length})`
                : `Verified Cattle Veterinarians (${vets.length})`}
            </Text>

            {vets.map((v) => (
              <View key={v.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.vetAvatar}>
                    <FontAwesome5 name="stethoscope" size={18} color="#059669" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{v.name}</Text>
                    <Text style={styles.vetSpecialty}>🩺 {v.specialization}</Text>
                    <Text style={styles.cardMeta}>🏥 {v.clinic} • 📍 {v.location}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => makeCall(v.name, v.phone)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                    <Text style={styles.callButtonText}>{language === 'hi' ? 'कॉल' : 'Call'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Cattle Ambulance Fleet */}
        {activeTab === 'ambulances' && (
          <View>
            <Text style={styles.sectionHeading}>
              {language === 'hi'
                ? `आपातकालीन पशु एम्बुलेंस सेवा (${ambulances.length})`
                : `Emergency Rescue Fleet (${ambulances.length})`}
            </Text>

            {ambulances.map((a) => (
              <View key={a.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.vetAvatar, { backgroundColor: '#FEE2E2' }]}>
                    <MaterialCommunityIcons name="ambulance" size={22} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{a.name}</Text>
                    <Text style={styles.vehicleType}>🚐 {a.vehicle}</Text>
                    <Text style={styles.cardMeta}>📍 {a.location} • 24x7 Ready</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.callButton, { backgroundColor: '#DC2626' }]}
                    onPress={() => makeCall(a.name, a.phone)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                    <Text style={styles.callButtonText}>{language === 'hi' ? 'रेस्क्यू' : 'Dispatch'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  catTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  catTabActive: {
    backgroundColor: '#ECFDF5',
  },
  catTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  catTabTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  vetSpecialty: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginTop: 1,
  },
  vehicleType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 1,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  callButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  capacityBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  capacityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  capacityText: {
    fontSize: 11,
    color: '#475569',
  },
  capacityPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
});
