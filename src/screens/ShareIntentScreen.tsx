import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShareIntentContext, ShareIntentFile } from 'expo-share-intent';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import { analyzeImage, getApiKey } from '../services/ai';
import { saveImage, saveItem } from '../services/storage';
import { generateId } from '../utils/id';
import type { CaptureItem } from '../types';

export default function ShareIntentScreen() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);

  const files = shareIntent.files?.filter(
    (f: ShareIntentFile) => f.mimeType?.startsWith('image/'),
  ) ?? [];

  const handleImport = async () => {
    if (!getApiKey()) {
      Alert.alert('API Key Required', 'Set your Claude API key in Settings first.');
      return;
    }
    if (files.length === 0) return;

    setProcessing(true);
    setTotal(files.length);
    setProcessed(0);

    let saved = 0;
    for (const file of files) {
      try {
        const savedUri = saveImage(file.path);
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
        saved++;
        setProcessed(saved);
      } catch (err) {
        console.error('Share intent import error:', err);
      }
    }

    setProcessing(false);
    Alert.alert(
      'Import Complete',
      `${saved} of ${files.length} image${files.length !== 1 ? 's' : ''} saved to your library.`,
      [{ text: 'OK', onPress: () => resetShareIntent() }],
    );
  };

  if (!hasShareIntent || files.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No images shared</Text>
          <TouchableOpacity style={styles.button} onPress={resetShareIntent}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Shared Images</Text>
      <Text style={styles.subtitle}>
        {files.length} image{files.length !== 1 ? 's' : ''} ready to import
      </Text>

      <ScrollView style={styles.preview} contentContainerStyle={styles.previewContent}>
        {files.map((file: ShareIntentFile, i: number) => (
          <Image
            key={file.path || i}
            source={{ uri: file.path }}
            style={styles.thumbnail}
          />
        ))}
      </ScrollView>

      {processing ? (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.progressText}>
            Analyzing {processed}/{total}...
          </Text>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.importButton} onPress={handleImport}>
            <Text style={styles.importButtonText}>
              Import & Analyze {files.length} Image{files.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={resetShareIntent}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  heading: { fontSize: fontSize.xl, fontWeight: '700', color: colors.onSurface },
  subtitle: { fontSize: fontSize.sm, color: colors.onSurfaceVariant, marginTop: spacing.xs },
  preview: { flex: 1, marginTop: spacing.md },
  previewContent: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumbnail: {
    width: 100, height: 100, borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  progressContainer: { alignItems: 'center', padding: spacing.lg },
  progressText: { color: colors.onSurfaceVariant, marginTop: spacing.sm, fontSize: fontSize.sm },
  actions: { paddingVertical: spacing.md, gap: spacing.sm },
  importButton: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  importButtonText: { color: '#fff', fontWeight: '600', fontSize: fontSize.md },
  cancelButton: {
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  cancelButtonText: { color: colors.onSurfaceVariant, fontSize: fontSize.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.onSurfaceVariant, fontSize: fontSize.md, marginBottom: spacing.md },
  button: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
  },
  buttonText: { color: colors.onSurface, fontSize: fontSize.sm },
});
