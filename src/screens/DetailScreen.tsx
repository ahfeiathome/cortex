import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import { deleteItem, getItem, saveItem } from '../services/storage';
import type { CaptureItem, TagType } from '../types';
import TagChip from '../components/TagChip';

const ALL_TAGS: TagType[] = [
  'idea',
  'todo',
  'reference',
  'inspiration',
  'quote',
  'screenshot',
  'code',
  'design',
  'article',
  'other',
];

interface DetailScreenProps {
  itemId: string;
  onBack: () => void;
}

export default function DetailScreen({ itemId, onBack }: DetailScreenProps) {
  const [item, setItem] = useState<CaptureItem | null>(null);
  const [notes, setNotes] = useState('');
  const [loaded, setLoaded] = useState(false);

  const loadItem = useCallback(async () => {
    const found = await getItem(itemId);
    if (found) {
      setItem(found);
      setNotes(found.notes);
    }
    setLoaded(true);
  }, [itemId]);

  React.useEffect(() => {
    loadItem();
  }, [loadItem]);

  const handleToggleTag = async (tag: TagType) => {
    if (!item) return;
    const newTags = item.tags.includes(tag)
      ? item.tags.filter((t) => t !== tag)
      : [...item.tags, tag];
    if (newTags.length === 0) return; // must have at least one tag
    const updated = { ...item, tags: newTags, updatedAt: new Date().toISOString() };
    setItem(updated);
    await saveItem(updated);
  };

  const handleSaveNotes = async () => {
    if (!item) return;
    const updated = { ...item, notes, updatedAt: new Date().toISOString() };
    setItem(updated);
    await saveItem(updated);
    Alert.alert('Saved', 'Notes updated.');
  };

  const handleDelete = () => {
    Alert.alert('Delete capture?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteItem(itemId);
          onBack();
        },
      },
    ]);
  };

  if (!loaded) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.loading}>Item not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        )}

        {!item.imageUri && item.textContent && (
          <View style={styles.textContentBox}>
            <Text style={styles.textContent}>{item.textContent}</Text>
          </View>
        )}

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.summary}>{item.summary}</Text>

        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsRow}>
          {ALL_TAGS.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              selected={item.tags.includes(tag)}
              onPress={handleToggleTag}
            />
          ))}
        </View>

        {item.extractedText ? (
          <>
            <Text style={styles.sectionTitle}>Extracted Text (OCR)</Text>
            <View style={styles.extractedBox}>
              <Text style={styles.extractedText}>{item.extractedText}</Text>
            </View>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add context or notes..."
          placeholderTextColor={colors.placeholder}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.saveNotesBtn}
          onPress={handleSaveNotes}
          activeOpacity={0.7}
        >
          <Text style={styles.saveNotesBtnText}>Save Notes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    padding: spacing.sm,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: spacing.sm,
  },
  deleteBtnText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.lg,
    resizeMode: 'contain',
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.md,
  },
  textContentBox: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  textContent: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  title: {
    color: colors.onBackground,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  date: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  summary: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    lineHeight: 22,
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  extractedBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  extractedText: {
    color: colors.onSurface,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.onSurface,
    fontSize: fontSize.md,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  saveNotesBtn: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  saveNotesBtnText: {
    color: colors.onSecondary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
