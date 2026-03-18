import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import { getAllItems } from '../services/storage';
import type { CaptureItem, TagType } from '../types';
import CaptureCard from '../components/CaptureCard';
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

interface LibraryScreenProps {
  onItemPress: (item: CaptureItem) => void;
}

export default function LibraryScreen({ onItemPress }: LibraryScreenProps) {
  const [items, setItems] = useState<CaptureItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const load = async () => {
        const all = await getAllItems();
        if (!cancelled) setItems(all);
      };
      load();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const filteredItems = items.filter((item) => {
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);
    if (!matchesTag) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.extractedText.toLowerCase().includes(q) ||
      (item.textContent?.toLowerCase().includes(q) ?? false) ||
      item.summary.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q)
    );
  });

  const handleTagPress = (tag: TagType) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🧠</Text>
      <Text style={styles.emptyTitle}>Your knowledge hub is empty</Text>
      <Text style={styles.emptySubtitle}>
        Capture a screenshot, photo, or note to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Library</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search captures..."
        placeholderTextColor={colors.placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.tagFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagFilters}
        >
          {ALL_TAGS.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              selected={selectedTag === tag}
              onPress={handleTagPress}
              small
            />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.count}>
        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
      </Text>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CaptureCard item={item} onPress={onItemPress} />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.onBackground,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.onSurface,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  tagFilterContainer: {
    marginBottom: spacing.sm,
  },
  tagFilters: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  count: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.onSurface,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
});
