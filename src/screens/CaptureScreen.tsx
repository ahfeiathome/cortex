import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import { analyzeImage, analyzeText, getApiKey } from '../services/ai';
import { saveImage, saveItem } from '../services/storage';
import { generateId } from '../utils/id';
import type { CaptureItem } from '../types';

export default function CaptureScreen() {
  const [noteText, setNoteText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = async (source: 'camera' | 'library') => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            'Permission needed',
            'Camera access is required to capture photos.'
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          quality: 0.8,
          allowsEditing: false,
        });
      } else {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            'Permission needed',
            'Photo library access is required to import images.'
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          quality: 0.8,
          allowsEditing: false,
        });
      }

      if (result.canceled || !result.assets?.[0]) return;

      setIsProcessing(true);
      const asset = result.assets[0];
      const savedUri = saveImage(asset.uri);
      const analysis = await analyzeImage(savedUri);

      const item: CaptureItem = {
        id: generateId(),
        title: analysis.title,
        tags: analysis.tags,
        category: analysis.category,
        summary: analysis.summary,
        extractedText: analysis.extracted_text,
        notes: '',
        imageUri: savedUri,
        textContent: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveItem(item);
      setIsProcessing(false);
      Alert.alert('Captured!', `"${item.title}" saved to your library.`);
    } catch (error) {
      setIsProcessing(false);
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture. Please try again.');
    }
  };

  const handleSaveNote = async () => {
    const text = noteText.trim();
    if (!text) {
      Alert.alert('Empty note', 'Please type something first.');
      return;
    }

    setIsProcessing(true);
    try {
      const analysis = await analyzeText(text);

      const item: CaptureItem = {
        id: generateId(),
        title: analysis.title,
        tags: analysis.tags,
        category: analysis.category,
        summary: analysis.summary,
        extractedText: '',
        notes: '',
        imageUri: null,
        textContent: text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveItem(item);
      setNoteText('');
      setIsProcessing(false);
      Alert.alert('Saved!', `"${item.title}" saved to your library.`);
    } catch (error) {
      setIsProcessing(false);
      console.error('Note save error:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  const hasApiKey = !!getApiKey();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.heading}>Capture</Text>
        <Text style={styles.subtitle}>
          Save a screenshot, photo, or quick note
        </Text>

        {!hasApiKey && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              No API key set. Captures will be saved without AI analysis. Go to
              Settings to add your Anthropic API key.
            </Text>
          </View>
        )}

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Analyzing with AI...</Text>
          </View>
        )}

        <View style={styles.captureButtons}>
          <TouchableOpacity
            style={styles.captureBtn}
            onPress={() => handleCapture('camera')}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <Text style={styles.captureBtnIcon}>📷</Text>
            <Text style={styles.captureBtnLabel}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureBtn}
            onPress={() => handleCapture('library')}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <Text style={styles.captureBtnIcon}>🖼</Text>
            <Text style={styles.captureBtnLabel}>Photo Library</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or type a note</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Type an idea, todo, or note..."
          placeholderTextColor={colors.placeholder}
          value={noteText}
          onChangeText={setNoteText}
          multiline
          textAlignVertical="top"
          editable={!isProcessing}
        />

        <TouchableOpacity
          style={[
            styles.saveBtn,
            (!noteText.trim() || isProcessing) && styles.saveBtnDisabled,
          ]}
          onPress={handleSaveNote}
          disabled={!noteText.trim() || isProcessing}
          activeOpacity={0.7}
        >
          <Text style={styles.saveBtnText}>Save Note</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    padding: spacing.lg,
  },
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  warning: {
    backgroundColor: '#3E2723',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  warningText: {
    color: '#FFAB91',
    fontSize: fontSize.sm,
  },
  processingOverlay: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  processingText: {
    color: colors.primary,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  captureButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  captureBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  captureBtnIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  captureBtnLabel: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginHorizontal: spacing.md,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.onSurface,
    fontSize: fontSize.md,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  saveBtnText: {
    color: colors.onPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
