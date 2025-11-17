import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Path, Text as SvgText, TextPath } from 'react-native-svg';

export default function App() {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.logoWrapper}>
        <Svg width={320} height={320}>
          <Defs>
            <Path id="outerTextPath" d="M 160 30 A 130 130 0 1 1 159.9 30" />
            <Path id="innerTextPath" d="M 160 290 A 130 130 0 1 0 159.9 290" />
          </Defs>

          <Circle cx="160" cy="160" r="150" stroke="#4b63ff" strokeWidth="1" fill="none" />
          <Circle cx="160" cy="160" r="120" stroke="#4b63ff" strokeWidth="2" fill="none" />
          <Circle cx="160" cy="160" r="95" stroke="#d3d7df" strokeWidth="1.5" fill="#ffffff" />

          <SvgText
            fill="#1756a5"
            fontSize="17"
            fontWeight="600"
            letterSpacing="3"
          >
            <TextPath href="#outerTextPath" startOffset="50%" textAnchor="middle">
              MAINTENANCE DE MATERIEL
            </TextPath>
          </SvgText>

          <SvgText
            fill="#1756a5"
            fontSize="17"
            fontWeight="600"
            letterSpacing="8"
          >
            <TextPath href="#innerTextPath" startOffset="50%" textAnchor="middle">
              AU   CONGO
            </TextPath>
          </SvgText>
        </Svg>

        <View style={styles.centerContent} pointerEvents="none">
          <Text style={styles.monogram}>MMC</Text>
          <Text style={styles.established}>EST. 2001</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Logo MMC reproduit en React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  logoWrapper: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  monogram: {
    fontSize: 64,
    fontWeight: '800',
    color: '#1756a5',
    letterSpacing: 6,
    textShadowColor: 'rgba(23, 86, 165, 0.35)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 3 },
  },
  established: {
    marginTop: 8,
    fontSize: 16,
    letterSpacing: 3,
    color: '#101010',
  },
  subtitle: {
    marginTop: 24,
    fontSize: 16,
    color: '#5a6275',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
