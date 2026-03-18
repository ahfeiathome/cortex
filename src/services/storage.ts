import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';
import type { CaptureItem } from '../types';

const ITEMS_KEY = '@cortex_items';

function getImageDir(): Directory {
  return new Directory(Paths.document, 'cortex-images');
}

function ensureImageDir(): void {
  const dir = getImageDir();
  if (!dir.exists) {
    dir.create({ intermediates: true });
  }
}

export function saveImage(sourceUri: string): string {
  ensureImageDir();
  const filename = `${Date.now()}.jpg`;
  const dest = new File(getImageDir(), filename);
  const source = new File(sourceUri);
  source.copy(dest);
  return dest.uri;
}

export function deleteImage(uri: string): void {
  const file = new File(uri);
  if (file.exists) {
    file.delete();
  }
}

export async function getAllItems(): Promise<CaptureItem[]> {
  const json = await AsyncStorage.getItem(ITEMS_KEY);
  if (!json) return [];
  return JSON.parse(json) as CaptureItem[];
}

export async function saveItem(item: CaptureItem): Promise<void> {
  const items = await getAllItems();
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export async function deleteItem(id: string): Promise<void> {
  const items = await getAllItems();
  const item = items.find((i) => i.id === id);
  if (item?.imageUri) {
    deleteImage(item.imageUri);
  }
  const filtered = items.filter((i) => i.id !== id);
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(filtered));
}

export async function getItem(id: string): Promise<CaptureItem | null> {
  const items = await getAllItems();
  return items.find((i) => i.id === id) ?? null;
}
