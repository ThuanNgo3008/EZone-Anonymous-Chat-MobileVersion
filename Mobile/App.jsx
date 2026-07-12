import React from 'react';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './src/navigation/AppNavigator';

// Fabric (New Architecture) trên RN 0.86 hiện có bug timing với native screens
// (FabricUIManager NullPointerException khi ScreensModule.setupFabric chạy trước
// khi Fabric UIManager sẵn sàng) -> tắt native screens, fallback về View thường.
enableScreens(false);

export default function App() {
  return <AppNavigator />;
}
