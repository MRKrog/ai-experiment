export interface Content {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  body: string;
  version: number;
  createdAt: Date;
}

export interface ContentFormData {
  title: string;
  body: string;
  status: Content['status'];
}

export interface ContentPreviewProps {
  content: string;
  className?: string;
}

export interface ContentFormProps {
  onSubmit: (data: ContentFormData) => void;
  initialData?: Partial<ContentFormData>;
  isLoading?: boolean;
}

export interface ContentHistoryProps {
  contentId: string;
  versions: ContentVersion[];
  onVersionSelect: (version: ContentVersion) => void;
} 