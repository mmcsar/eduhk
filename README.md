# MMC - Maintenance de Matériel au Congo

A professional React Native mobile application for MMC (Maintenance de Matériel au Congo), established in 2001.

## 🚀 Features

- **Modern UI/UX Design** - Clean and professional interface with MMC branding
- **Service Overview** - Display of maintenance, installation, repair, and inspection services
- **Bottom Navigation** - Easy navigation between Home, Services, Contact, and Profile sections
- **Responsive Layout** - Optimized for both iOS and Android devices
- **Company Information** - Showcase of 20+ years of experience and key features

## 📱 Screenshots

The app features:
- MMC logo prominently displayed in the header
- Service cards with intuitive icons
- Feature list highlighting company strengths
- Call-to-action button for requesting services
- Bottom navigation for easy app navigation

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development and build toolchain
- **React Native Paper** - Material Design components
- **React Navigation** - Navigation library

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional but recommended)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

4. **Run on device/emulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 📱 Running the App

### Using Expo Go (Recommended for development)

1. Install Expo Go on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Run `npm start` in the project directory

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Using Emulators

#### iOS Simulator (macOS only)
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

## 📁 Project Structure

```
/workspace
├── App.js                  # Main application component
├── package.json            # Dependencies and scripts
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── components/            # Reusable components
│   ├── Header.js
│   ├── ServiceCard.js
│   └── BottomNavigation.js
├── screens/               # Screen components
│   └── HomeScreen.js
├── assets/                # Images, fonts, etc.
└── README.md              # This file
```

## 🎨 Customization

### Colors

The main brand colors used in the app:
- **Primary Blue**: `#1565C0`
- **Light Blue**: `#E3F2FD`
- **Success Green**: `#4CAF50`
- **Background**: `#F5F5F5`

To customize colors, edit the `styles` object in the respective component files.

### Services

To add or modify services, edit the `ServiceCard` components in `App.js` or `screens/HomeScreen.js`:

```javascript
<ServiceCard 
  icon="🔧"
  title="Your Service"
  description="Service description"
/>
```

## 🚀 Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 📝 Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
API_URL=https://api.mmc-congo.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by MMC (Maintenance de Matériel au Congo).

## 📞 Contact

**MMC - Maintenance de Matériel**
- Established: 2001
- Location: Congo
- Website: [Your website]
- Email: [Your email]
- Phone: [Your phone]

---

Made with ❤️ for MMC - Maintenance de Matériel au Congo
