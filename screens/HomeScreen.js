import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ServiceCard from '../components/ServiceCard';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos Services</Text>
        
        <View style={styles.servicesGrid}>
          <ServiceCard 
            icon="🔧"
            title="Maintenance"
            description="Entretien et réparation de matériel"
          />
          <ServiceCard 
            icon="⚙️"
            title="Installation"
            description="Installation d'équipements industriels"
          />
          <ServiceCard 
            icon="🛠️"
            title="Réparation"
            description="Service de réparation rapide"
          />
          <ServiceCard 
            icon="📋"
            title="Inspection"
            description="Contrôle qualité et diagnostic"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pourquoi MMC?</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Plus de 20 ans d'expérience</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Techniciens qualifiés et certifiés</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Service disponible 24/7</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Équipements de haute qualité</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Demander un Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 15,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  ctaButton: {
    backgroundColor: '#1565C0',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
