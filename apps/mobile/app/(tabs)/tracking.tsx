import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';

export default function TrackingScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<any>(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert(t('tracking.permissionDenied'));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const toggleTracking = () => {
    setTracking(!tracking);
    // In production: start/stop background location tracking
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || -11.6645,
          longitude: location?.coords.longitude || 27.4794,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        followsUserLocation
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={t('tracking.yourLocation')}
          />
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('tracking.currentSpeed')}</Text>
          <Text style={styles.infoValue}>0 km/h</Text>
        </View>

        <TouchableOpacity
          style={[styles.trackButton, tracking && styles.trackButtonActive]}
          onPress={toggleTracking}
        >
          <Text style={styles.trackButtonText}>
            {tracking ? t('tracking.stopTracking') : t('tracking.startTracking')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackButtonActive: {
    backgroundColor: '#dc2626',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
