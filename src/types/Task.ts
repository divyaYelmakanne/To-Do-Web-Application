export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  dueTime?: string;
  tags: string[];
  listId: string;
  subtasks: SubTask[];
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  taskCount: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  today: number;
  upcoming: number;
}