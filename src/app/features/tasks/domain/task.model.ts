export const TASK_STATUSES = ['todo', 'in-progress', 'blocked', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string; // 'YYYY-MM-DD'
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type TaskInput = Omit<SprintTask, 'id' | 'createdAt' | 'updatedAt'>;
export type TaskStatusFilter = TaskStatus | 'all';
export type TaskPriorityFilter = TaskPriority | 'all';