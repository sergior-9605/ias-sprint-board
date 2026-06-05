import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskStore } from '../../state/task-store';
import { PriorityBadge } from '../../ui/priority-badge/priority-badge';
import { StatusBadge } from '../../ui/status-badge/status-badge';

@Component({
  selector: 'app-task-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, 
    DatePipe, 
    StatusBadge, 
    PriorityBadge
  ],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {

  protected readonly store = inject(TaskStore);
  private readonly route = inject(ActivatedRoute);
  protected readonly task = this.store.selectedTask;

  ngOnInit(): void {
    this.store.select(this.route.snapshot.paramMap.get('id'));
    if (this.store.tasks().length === 0)
      this.store.load();
  }
}
