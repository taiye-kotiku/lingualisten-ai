# LinguaListen 🎧

A React Native mobile application for learning Yoruba through interactive flashcards with audio pronunciation. Built with Expo and designed for cross-platform compatibility.

## 📱 Features

### Core Functionality
- **QR Code Scanning**: Scan QR codes on physical flashcards to access audio content
- **Manual Code Entry**: Enter flashcard codes manually for audio playback
- **Audio Playback**: High-quality audio pronunciation with play/pause controls
- **Content Browsing**: Browse and search through available phrases
- **Progress Tracking**: Monitor learning statistics and recent activity

### User Experience
- **Dark/Light Theme**: System-wide theme switching with persistent preferences
- **User Authentication**: Email-based sign-up and login system
- **Profile Management**: Comprehensive user profile with editing capabilities
- **Settings & Preferences**: Customizable notifications, sound effects, and theme settings

### Support & Help
- **Help Center**: FAQ section with expandable answers
- **Contact Support**: Direct email and phone support integration
- **Privacy Policy**: Comprehensive privacy policy and terms
- **About Section**: App information, features, and credits

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Physical device with Expo Go app (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lingualisten.git
   cd lingualisten
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI (if not already installed)**
   ```bash
   npm install -g @expo/cli
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 📁 Project Structure

```
LinguaListen/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Generic components (buttons, inputs, etc.)
│   │   ├── app/           # App-specific components
│   │   └── layout/        # Layout components
│   ├── screens/            # Screen components
│   │   ├── Auth/          # Authentication screens
│   │   └── App/           # Main app screens
│   ├── navigation/         # Navigation configuration
│   ├── context/           # React Context providers
│   ├── constants/         # App constants and dummy data
│   ├── types/             # TypeScript type definitions
│   ├── services/          # API services (future implementation)
│   ├── store/             # State management (future implementation)
│   └── utils/             # Utility functions
├── assets/                 # Static assets (images, fonts, icons)
├── App.tsx                # Root component
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### Typography
- **Headers**: Nunito (SemiBold/Bold)
- **Body Text**: Inter (Regular/Medium)
- **Font Sizes**: 12px - 30px with consistent line heights

### Colors
- **Primary**: #F97316 (Orange)
- **Secondary**: #78B242 (Green)
- **Error**: #EF4444 (Red)
- **Text**: Dynamic based on theme
- **Background**: Dynamic based on theme

### Components
- Custom styled text inputs with icon support
- Themed buttons with loading states
- Custom switch components
- Empty state components
- Loading spinners

## 📱 Screens Overview

### Authentication Flow
- **LoginScreen**: Email/password login with "Forgot Password" option
- **SignUpScreen**: User registration with form validation
- **PasswordRecoveryScreen**: Password reset functionality

### Main App Flow
- **HomeScreen**: Code entry, QR scanning, and recent activity
- **BrowseScreen**: Grid view of phrases with search and filtering
- **ProfileScreen**: User profile, statistics, and settings
- **ContentDisplayScreen**: Audio playback for individual phrases

### Profile Sub-screens
- **EditProfileScreen**: Profile information editing
- **HelpSupportScreen**: FAQ and contact support
- **PrivacyPolicyScreen**: Privacy policy and data handling
- **AboutScreen**: App information and credits

## 🛠 Technical Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library

### Key Dependencies
- **@react-navigation/native**: Navigation framework
- **@react-navigation/bottom-tabs**: Bottom tab navigation
- **@react-navigation/native-stack**: Stack navigation
- **expo-camera**: QR code scanning functionality
- **expo-audio**: Audio playback capabilities
- **@expo/vector-icons**: Icon library
- **@react-native-async-storage/async-storage**: Local data persistence

### Development Tools
- **Expo CLI**: Development server and build tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🌍 Localization

Currently supports:
- **Yoruba**: Primary language for phrases
- **English**: Interface language and translations

## 📊 Data Structure

### Phrase Data
```typescript
interface PhraseData {
    code: string;           // Unique flashcard code
    phrase: string;         // Yoruba phrase
    translation: string;    // English translation
    audioUrl: string;       // Audio file URL
}
```

### User Data
```typescript
interface UserData {
    name: string;
    email: string;
    joinDate: string;
    avatar: string;
}
```

## 🔧 Configuration

### Theme Configuration
The app supports dynamic theming with light and dark modes. Theme preferences are persisted using AsyncStorage.

### Audio Configuration
Audio playback is handled using expo-audio with proper lifecycle management and error handling.

### Navigation Configuration
Type-safe navigation with proper parameter passing between screens.

## 📱 Platform Support

- **iOS**: Full support with native iOS design patterns
- **Android**: Full support with Material Design elements
- **Web**: Basic support (Expo web compatibility)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Authentication flow (login, signup, password recovery)
- [ ] QR code scanning functionality
- [ ] Audio playback on different devices
- [ ] Theme switching persistence
- [ ] Navigation between all screens
- [ ] Form validation and error handling
- [ ] Profile editing functionality
- [ ] Help & Support features (FAQ, contact options)
- [ ] Privacy Policy and About screens
- [ ] Custom switch components in settings

### Test Data
The app includes comprehensive dummy data for testing:
- 10 Yoruba phrases with English translations
- Mock user profile data
- Sample recent activity
- Learning statistics

## 🚀 Deployment

### Building for Production

1. **Configure app.json**
   ```bash
   # Update app.json with production settings
   ```

2. **Build for iOS**
   ```bash
   npx eas build --platform ios
   ```

3. **Build for Android**
   ```bash
   npx eas build --platform android
   ```

### App Store Submission
Follow Expo's guidelines for submitting to:
- Apple App Store
- Google Play Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add proper type definitions
- Include JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - Initial work and ongoing maintenance
- **Yoruba Language Community** - Cultural guidance and content validation

## 🙏 Acknowledgments

- Yoruba language community for cultural guidance
- Expo team for the excellent development platform
- React Native community for continuous improvements
- Feather Icons for beautiful iconography

## 📞 Support

For support and inquiries:
- **Email**: support@lingualisten.com
- **Phone**: +234 801 234 5678
- **Website**: www.lingualisten.com

## 🔮 Future Enhancements

- [ ] Offline mode for downloaded content
- [ ] User-generated content and community features
- [ ] Advanced analytics and learning insights
- [ ] Integration with external language learning platforms
- [ ] Voice recording and pronunciation comparison
- [ ] Gamification elements (badges, streaks, leaderboards)
- [ ] Additional African languages support

---

**Built with ❤️ for language learners everywhere** 