export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskStatus = 'all' | 'active' | 'completed' | 'in-progress';