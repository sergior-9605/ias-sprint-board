import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TaskStatus } from '../../domain/task.model';

const STATUS_META: Record<TaskStatus, { label: string; classes: string }> = {
  'todo': { label: 'Por hacer', classes: 'bg-slate-100 text-slate-600 border border-slate-200' },
  'in-progress': { label: 'En progreso', classes: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  'blocked': { label: 'Bloqueada', classes: 'bg-red-50 text-red-700 border border-red-200' },
  'done': { label: 'Hecha', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
};

@Component({
  selector: 'app-status-badge',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  readonly status = input.required<TaskStatus>();
  protected readonly meta = computed(() => STATUS_META[this.status()]);
}
