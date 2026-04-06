import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent';
import { colors } from './src/constants/theme';
import { setApiKey } from './src/services/ai';
import CaptureScreen from './src/screens/CaptureScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import DetailScreen from './src/screens/DetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ShareIntentScreen from './src/screens/ShareIntentScreen';
import BulkImportScreen from './src/screens/BulkImportScreen';
import type { CaptureItem } from './src/types';

const Tab = createBottomTabNavigator();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.onSurface,
    border: colors.border,
    notification: colors.error,
  },
};

const API_KEY_STORAGE_KEY = '@cortex_api_key';

function LibraryWithDetail() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  if (selectedItemId) {
    return (
      <DetailScreen
        itemId={selectedItemId}
        onBack={() => setSelectedItemId(null)}
      />
    );
  }

  return (
    <LibraryScreen
      onItemPress={(item: CaptureItem) => setSelectedItemId(item.id)}
    />
  );
}

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Capture: '📷',
    Import: '📁',
    Library: '📚',
    Settings: '⚙️',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? '?'}
    </Text>
  );
}

function AppContent() {
  const { hasShareIntent } = useShareIntentContext();

  // When a share intent arrives, show the share intent screen instead of tabs
  if (hasShareIntent) {
    return <ShareIntentScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      })}
    >
      <Tab.Screen name="Capture" component={CaptureScreen} />
      <Tab.Screen name="Import" component={BulkImportScreen} />
      <Tab.Screen name="Library" component={LibraryWithDetail} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storedKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKey(storedKey);
      }
      setReady(true);
    };
    init();
  }, []);

  if (!ready) return null;

  return (
    <ShareIntentProvider
      options={{ debug: false, resetOnBackground: true }}
    >
      <SafeAreaProvider>
        <NavigationContainer theme={DarkTheme}>
          <AppContent />
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </ShareIntentProvider>
  );
}
