export type TagType =
  | 'idea'
  | 'todo'
  | 'reference'
  | 'inspiration'
  | 'quote'
  | 'screenshot'
  | 'code'
  | 'design'
  | 'article'
  | 'other';

export type CategoryType =
  | 'idea'
  | 'todo'
  | 'reference'
  | 'inspiration'
  | 'other';

export interface CaptureItem {
  id: string;
  title: string;
  tags: TagType[];
  category: CategoryType;
  summary: string;
  extractedText: string;
  notes: string;
  imageUri: string | null;
  textContent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysisResult {
  title: string;
  tags: TagType[];
  extracted_text: string;
  category: CategoryType;
  summary: string;
}

export type RootTabParamList = {
  Capture: undefined;
  Library: undefined;
};

export type LibraryStackParamList = {
  LibraryList: undefined;
  Detail: { itemId: string };
};
