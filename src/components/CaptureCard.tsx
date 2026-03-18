import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import type { CaptureItem } from '../types';
import TagChip from './TagChip';

interface CaptureCardProps {
  item: CaptureItem;
  onPress: (item: CaptureItem) => void;
}

export default function CaptureCard({ item, onPress }: CaptureCardProps) {
  const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      )}
      {!item.imageUri && item.textContent && (
        <View style={styles.textThumb}>
          <Text style={styles.textThumbContent} numberOfLines={3}>
            {item.textContent}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.tags}>
          {item.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} tag={tag} small />
          ))}
        </View>
        <Text style={styles.date}>{dateStr}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  textThumb: {
    width: 100,
    height: 100,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    padding: spacing.sm,
  },
  textThumbContent: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.xs,
  },
  content: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  title: {
    color: colors.onSurface,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  date: {
    color: colors.onSurfaceVariant,
    fontSize: fontSize.xs,
  },
});
