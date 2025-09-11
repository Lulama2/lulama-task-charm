export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskStatus = 'all' | 'active' | 'completed';