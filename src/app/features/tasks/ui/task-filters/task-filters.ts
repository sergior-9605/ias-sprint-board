import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  TASK_PRIORITIES, TASK_STATUSES, TaskPriority, TaskPriorityFilter, TaskStatus, TaskStatusFilter,
} from '../../domain/task.model';

const STATUS_LABELS: Record<TaskStatus, string> = { 'todo': 'Por hacer', 'in-progress': 'En progreso', 'blocked': 'Bloqueada', 'done': 'Hecha' };
const PRIORITY_LABELS: Record<TaskPriority, string> = { low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' };

@Component({
  selector: 'app-task-filters',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.css',
})
export class TaskFilters {
  readonly search = input('');
  readonly status = input<TaskStatusFilter>('all');
  readonly priority = input<TaskPriorityFilter>('all');
  readonly searchChange = output<string>();
  readonly statusChange = output<TaskStatusFilter>();
  readonly priorityChange = output<TaskPriorityFilter>();

  protected readonly statuses = TASK_STATUSES;
  protected readonly priorities = TASK_PRIORITIES;
  protected readonly statusLabels = STATUS_LABELS;
  protected readonly priorityLabels = PRIORITY_LABELS;

  protected onSearch(e: Event): void { this.searchChange.emit((e.target as HTMLInputElement).value); }
  protected onStatus(e: Event): void { this.statusChange.emit((e.target as HTMLSelectElement).value as TaskStatusFilter); }
  protected onPriority(e: Event): void { this.priorityChange.emit((e.target as HTMLSelectElement).value as TaskPriorityFilter); }
}
