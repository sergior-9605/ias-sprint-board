import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TaskPriority } from '../../domain/task.model';

const PRIORITY_META: Record<TaskPriority, { label: string; classes: string }> = {
  low: { label: 'Baja', classes: 'bg-slate-100 text-slate-600 border border-slate-200' },
  medium: { label: 'Media', classes: 'bg-amber-50 text-amber-700 border border-amber-200' },
  high: { label: 'Alta', classes: 'bg-orange-50 text-orange-700 border border-orange-200' },
  critical: { label: 'Crítica', classes: 'bg-red-50 text-red-700 border border-red-200' },
};

@Component({
  selector: 'app-priority-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './priority-badge.html',
  styleUrl: './priority-badge.css',
})
export class PriorityBadge {
  readonly priority = input.required<TaskPriority>();
  protected readonly meta = computed(() => PRIORITY_META[this.priority()]);
}
