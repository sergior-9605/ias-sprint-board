import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskStore } from '../../state/task-store';
import { TaskCard } from '../../ui/task-card/task-card';
import { TaskFilters } from '../../ui/task-filters/task-filters';

@Component({
  selector: 'app-task-dashboard',
  imports: [
    RouterLink,
    TaskFilters,
    TaskCard
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.css',
})
export class TaskDashboard implements OnInit {
  protected readonly store = inject(TaskStore);

  protected readonly viewState = computed<'loading' | 'error' | 'empty' | 'success'>(() => {
    if (this.store.loading()) return 'loading';
    if (this.store.error()) return 'error';
    if (this.store.isEmpty()) return 'empty';
    return 'success';
  });

  ngOnInit(): void {
    this.store.load();
  }
}
