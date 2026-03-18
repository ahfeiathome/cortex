import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import { setApiKey } from '../services/ai';

const API_KEY_STORAGE_KEY = '@cortex_api_key';

export default function SettingsScreen() {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      if (stored) {
        setKey(stored);
        setApiKey(stored);
        setSaved(true);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    const trimmed = key.trim();
    if (!trimmed) {
      Alert.alert('Empty key', 'Please enter your Anthropic API key.');
      return;
    }
    await AsyncStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    setSaved(true);
    Alert.alert('Saved', 'API key saved. AI analysis is now enabled.');
  };

  const handleClear = async () => {
    await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setKey('');
    setSaved(false);
    Alert.alert('Cleared', 'API key removed.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Anthropic API Key</Text>
        <Text style={styles.sectionDesc}>
          Required for AI-powered auto-tagging, OCR, and analysis. Your key is
          stored locally on this device only.
        </Text>

        <TextInput
          style={styles.input}
          value={key}
          onChangeText={(t) => {
            setKey(t);
            setSaved(false);
          }}
          placeholder="sk-ant-..."
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.savedBtn]}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveBtnText}>
              {saved ? 'Saved' : 'Save Key'}
            </Text>
          </TouchableOpacity>

          {key.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Cortex v1.0.0 — AI-powered knowledge hub
        </Text>
        <Text style={styles.aboutText}>Capture, analyze, organize, reference.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.onBackground,
    marginBottom: spacing.lg,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  sectionDesc: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.onSurface,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  savedBtn: {
    backgroundColor: colors.secondaryVariant,
  },
  saveBtnText: {
    color: colors.onPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  clearBtn: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.error,
  },
  clearBtnText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  aboutText: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
