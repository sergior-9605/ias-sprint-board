import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SprintTask, TaskPriority } from '../../domain/task.model';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { StatusBadge } from '../status-badge/status-badge';

const PRIORITY_DOT: Record<TaskPriority, string> = {
  low: 'bg-slate-300',
  medium: 'bg-amber-400',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

@Component({
  selector: 'app-task-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, 
    StatusBadge, 
    PriorityBadge
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  readonly task = input.required<SprintTask>();
  protected readonly priorityDot = computed(() => PRIORITY_DOT[this.task().priority]);
}
