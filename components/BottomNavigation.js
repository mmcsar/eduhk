import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Accueil' },
    { id: 'services', icon: '🔧', label: 'Services' },
    { id: 'contact', icon: '📞', label: 'Contact' },
    { id: 'profile', icon: '👤', label: 'Profil' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.navItem, activeTab === tab.id && styles.navItemActive]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text style={styles.navIcon}>{tab.icon}</Text>
          <Text style={[styles.navText, activeTab === tab.id && styles.navTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    borderTopWidth: 3,
    borderTopColor: '#1565C0',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 11,
    color: '#666',
  },
  navTextActive: {
    color: '#1565C0',
    fontWeight: 'bold',
  },
});
