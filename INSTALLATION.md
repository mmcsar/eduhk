# Installation Guide - MMC Mobile App

## Quick Start Guide

Follow these steps to get the MMC app running on your device:

### Step 1: Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Recommended version: 18.x or higher
- Verify installation: `node --version`

### Step 2: Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- React Native
- Expo
- React Navigation
- React Native Paper
- And other dependencies

### Step 3: Start the Development Server

```bash
npm start
```

This will start the Expo development server and display a QR code.

### Step 4: Run on Your Device

#### Option A: Using Expo Go (Easiest)

1. **Install Expo Go** on your smartphone:
   - [iPhone/iPad](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code**:
   - **iOS**: Open Camera app and scan the QR code
   - **Android**: Open Expo Go app and tap "Scan QR Code"

#### Option B: Using Emulator

**For iOS (macOS only):**
```bash
npm run ios
```
*Requires Xcode to be installed*

**For Android:**
```bash
npm run android
```
*Requires Android Studio and an emulator to be set up*

## Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules
npm install
```

### Issue: Metro bundler won't start

**Solution:**
```bash
npx expo start -c
```
The `-c` flag clears the cache.

### Issue: App won't connect to development server

**Solution:**
- Make sure your phone and computer are on the same Wi-Fi network
- Try using tunnel connection: `npm start -- --tunnel`
- Check if firewall is blocking the connection

### Issue: Expo Go app shows "Unable to resolve module"

**Solution:**
1. Stop the server (Ctrl+C)
2. Clear cache: `npx expo start -c`
3. Reload the app in Expo Go

## System Requirements

### Development Machine
- **OS**: Windows 10+, macOS 10.14+, or Linux
- **RAM**: 8GB minimum (16GB recommended)
- **Node.js**: 14.x or higher
- **npm**: 6.x or higher

### Mobile Device (for Expo Go)
- **iOS**: iOS 13.0 or higher
- **Android**: Android 6.0 (API 23) or higher

### Emulators
- **iOS Simulator**: Xcode 12+ (macOS only)
- **Android Emulator**: Android Studio with SDK 28+

## Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |

## Next Steps

After successfully running the app:

1. **Customize branding**: Update colors and styles in component files
2. **Add assets**: Place icon and splash images in `/assets` directory
3. **Implement features**: Add functionality to service cards and forms
4. **Test thoroughly**: Test on both iOS and Android devices
5. **Build for production**: Use `expo build` or EAS Build

## Need Help?

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **Stack Overflow**: Tag your questions with `react-native` and `expo`

## Building for Production

When ready to deploy:

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Using Classic Build

```bash
# For Android APK
expo build:android -t apk

# For iOS IPA
expo build:ios
```

---

**Made for MMC - Maintenance de Matériel au Congo** 🇨🇩
