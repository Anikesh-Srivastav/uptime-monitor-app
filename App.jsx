import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AppProvider from './src/providers/AppProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { useTheme } from './src/theme/ThemeContext';

// AppContent lives inside AppProvider so it can access ThemeContext
function AppContent() {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme.statusBar} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
