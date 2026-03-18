import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import type { TagType } from '../types';

interface TagChipProps {
  tag: TagType;
  selected?: boolean;
  onPress?: (tag: TagType) => void;
  small?: boolean;
}

const TAG_COLORS: Record<TagType, string> = {
  idea: '#FFD54F',
  todo: '#EF5350',
  reference: '#42A5F5',
  inspiration: '#AB47BC',
  quote: '#26A69A',
  screenshot: '#78909C',
  code: '#66BB6A',
  design: '#FF7043',
  article: '#5C6BC0',
  other: '#BDBDBD',
};

export default function TagChip({ tag, selected, onPress, small }: TagChipProps) {
  const tagColor = TAG_COLORS[tag];

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        small && styles.chipSmall,
        { borderColor: tagColor },
        selected && { backgroundColor: tagColor },
      ]}
      onPress={() => onPress?.(tag)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          small && styles.labelSmall,
          { color: selected ? colors.onPrimary : tagColor },
        ]}
      >
        {tag}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  labelSmall: {
    fontSize: fontSize.xs,
  },
});
