import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { colors, borderRadius, spacing, fontSize } from '../constants/theme';
import { analyzeImage, getApiKey } from '../services/ai';
import { saveImage, saveItem } from '../services/storage';
import { generateId } from '../utils/id';
import type { CaptureItem } from '../types';

type ViewMode = 'albums' | 'assets' | 'importing';

export default function BulkImportScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [viewMode, setViewMode] = useState<ViewMode>('albums');
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  // Request permission on mount
  useEffect(() => {
    if (permissionResponse && !permissionResponse.granted) {
      requestPermission();
    }
  }, [permissionResponse]);

  // Load albums
  useEffect(() => {
    if (!permissionResponse?.granted) return;
    loadAlbums();
  }, [permissionResponse?.granted]);

  const loadAlbums = async () => {
    setLoading(true);
    const fetched = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });
    // Sort by asset count descending, filter out empty albums
    const sorted = fetched
      .filter((a) => (a.assetCount ?? 0) > 0)
      .sort((a, b) => (b.assetCount ?? 0) - (a.assetCount ?? 0));
    setAlbums(sorted);
    setLoading(false);
  };

  const loadAlbumAssets = async (album: MediaLibrary.Album) => {
    setSelectedAlbum(album);
    setViewMode('assets');
    setLoading(true);
    setSelected(new Set());
    const result = await MediaLibrary.getAssetsAsync({
      album,
      mediaType: 'photo',
      first: 200,
      sortBy: [MediaLibrary.SortBy.creationTime],
    });
    setAssets(result.assets);
    setLoading(false);
  };

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => {
    setSelected(new Set(assets.map((a) => a.id)));
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  const handleImport = async () => {
    if (!getApiKey()) {
      Alert.alert('API Key Required', 'Set your Claude API key in Settings first.');
      return;
    }
    if (selected.size === 0) return;

    setViewMode('importing');
    setImporting(true);
    setProgress({ done: 0, total: selected.size });

    const selectedAssets = assets.filter((a) => selected.has(a.id));
    let saved = 0;

    for (const asset of selectedAssets) {
      try {
        // Get full asset info with local URI
        const info = await MediaLibrary.getAssetInfoAsync(asset);
        const uri = info.localUri || asset.uri;
        const savedUri = saveImage(uri);
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
          createdAt: asset.creationTime
            ? new Date(asset.creationTime).toISOString()
            : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await saveItem(item);
        saved++;
        setProgress({ done: saved, total: selected.size });
      } catch (err) {
        console.error('Bulk import error for asset:', asset.id, err);
      }
    }

    setImporting(false);
    Alert.alert(
      'Import Complete',
      `${saved} of ${selected.size} photo${selected.size !== 1 ? 's' : ''} imported and analyzed.`,
      [{ text: 'OK', onPress: () => { setViewMode('albums'); setSelected(new Set()); } }],
    );
  };

  if (!permissionResponse?.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Photo library access required</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Importing progress view
  if (viewMode === 'importing') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.heading}>Importing & Analyzing</Text>
          <Text style={styles.progressText}>
            {progress.done} / {progress.total} photos
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progress.done / Math.max(progress.total, 1)) * 100}%` },
              ]}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Album list view
  if (viewMode === 'albums') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.heading}>Import Photos</Text>
        <Text style={styles.subtitle}>Select an album to browse</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <FlatList
            data={albums}
            keyExtractor={(a) => a.id}
            style={{ marginTop: spacing.md }}
            renderItem={({ item: album }) => (
              <TouchableOpacity
                style={styles.albumRow}
                onPress={() => loadAlbumAssets(album)}
              >
                <View style={styles.albumInfo}>
                  <Text style={styles.albumTitle}>{album.title}</Text>
                  <Text style={styles.albumCount}>{album.assetCount ?? 0} photos</Text>
                </View>
                <Text style={styles.chevron}>&rsaquo;</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    );
  }

  // Asset grid view (multi-select)
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setViewMode('albums')}>
          <Text style={styles.backBtn}>&lsaquo; Albums</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {selectedAlbum?.title}
        </Text>
      </View>

      <View style={styles.selectionBar}>
        <Text style={styles.selectionText}>
          {selected.size} selected
        </Text>
        <View style={styles.selectionActions}>
          <TouchableOpacity onPress={selectAll}>
            <Text style={styles.actionLink}>Select All</Text>
          </TouchableOpacity>
          {selected.size > 0 && (
            <TouchableOpacity onPress={clearSelection}>
              <Text style={styles.actionLink}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(a) => a.id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item: asset }) => {
            const isSelected = selected.has(asset.id);
            return (
              <TouchableOpacity
                style={[styles.assetCell, isSelected && styles.assetSelected]}
                onPress={() => toggleSelect(asset.id)}
              >
                <Image source={{ uri: asset.uri }} style={styles.assetImage} />
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>&#10003;</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {selected.size > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleImport}>
            <Text style={styles.primaryBtnText}>
              Import & Analyze {selected.size} Photo{selected.size !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  heading: { fontSize: fontSize.xl, fontWeight: '700', color: colors.onSurface },
  subtitle: { fontSize: fontSize.sm, color: colors.onSurfaceVariant, marginTop: spacing.xs },
  emptyText: { color: colors.onSurfaceVariant, fontSize: fontSize.md },

  // Album list
  albumRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  albumInfo: { flex: 1 },
  albumTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.onSurface },
  albumCount: { fontSize: fontSize.xs, color: colors.onSurfaceVariant, marginTop: 2 },
  chevron: { fontSize: 24, color: colors.onSurfaceVariant },

  // Asset grid header
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  backBtn: { fontSize: fontSize.lg, color: colors.primary, fontWeight: '600' },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.onSurface, flex: 1 },

  // Selection bar
  selectionBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectionText: { fontSize: fontSize.sm, color: colors.onSurfaceVariant },
  selectionActions: { flexDirection: 'row', gap: spacing.md },
  actionLink: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '600' },

  // Asset grid
  gridContent: { gap: 2 },
  assetCell: { flex: 1 / 3, aspectRatio: 1, padding: 1 },
  assetSelected: { opacity: 0.7 },
  assetImage: { flex: 1, borderRadius: 2, backgroundColor: colors.surface },
  checkBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  checkText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Progress
  progressText: { color: colors.onSurfaceVariant, fontSize: fontSize.md },
  progressBar: {
    width: '80%', height: 6, backgroundColor: colors.surface,
    borderRadius: 3, overflow: 'hidden', marginTop: spacing.sm,
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },

  // Bottom bar
  bottomBar: { paddingVertical: spacing.sm },
  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: fontSize.md },
});
