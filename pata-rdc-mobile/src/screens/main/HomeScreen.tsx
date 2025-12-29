import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Welcome, {user?.firstName}! 👋</Text>
          <Text style={styles.subtitle}>Find services near you</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Coming soon...</Text>
          <Text style={styles.placeholderSubtext}>Browse services here</Text>
        </View>

        <Button title="Logout" onPress={handleLogout} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginVertical: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

