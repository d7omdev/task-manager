export interface TaskAttachment {
  id: string;
  uri: string;
  name: string;
  type: 'image' | 'file';
  size?: number;
  contentUri?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO 8601 string for easier serialization
  completedAt: string | null; // When task was completed
  dueDate: string | null; // Optional due date (ISO 8601)
  dueTime: string | null; // Optional due time (HH:MM format)
  priority: 'low' | 'medium' | 'high';
  lastModified: string; // For cloud sync (ISO 8601)
  attachments?: TaskAttachment[]; // Files and images
}

export type TaskStatus = 'all' | 'active' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskFormData {
  text: string;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: TaskPriority;
}
