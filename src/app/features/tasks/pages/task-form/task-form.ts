import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskInput, TaskPriority, TaskStatus, TASK_PRIORITIES, TASK_STATUSES } from '../../domain/task.model';
import { TaskStore } from '../../state/task-store';

import { futureDateValidator } from '../../../../shared/validators/future-date.validator';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(TaskStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly statuses = TASK_STATUSES;
  protected readonly priorities = TASK_PRIORITIES;
  protected readonly submitting = this.store.loading;
  protected readonly taskId = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = !!this.taskId;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
    status: this.fb.nonNullable.control<TaskStatus>('todo', Validators.required),
    priority: this.fb.nonNullable.control<TaskPriority>('medium', Validators.required),
    assignee: ['', [Validators.required, Validators.minLength(3)]],
    dueDate: ['', [Validators.required, futureDateValidator()]],
    tags: [''],
  });

  constructor() {
    if (this.isEditMode && this.taskId) {
      this.store.select(this.taskId);
      if (this.store.tasks().length === 0) {
        this.store.load();
      }
      effect(() => {
        const task = this.store.selectedTask();
        if (task && this.form.pristine) {
          this.form.patchValue({
            title: task.title, description: task.description, status: task.status,
            priority: task.priority, assignee: task.assignee, dueDate: task.dueDate,
            tags: task.tags.join(', '),
          });
        }
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const input = this.toTaskInput();
    const request$ = this.isEditMode && this.taskId
      ? this.store.update(this.taskId, input)
      : this.store.create(input);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => { },
    });
  }

  private toTaskInput(): TaskInput {
    const value = this.form.getRawValue();
    const tags = [...new Set(value.tags.split(',').map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0))];
    return {
      title: value.title.trim(), description: value.description.trim(),
      status: value.status, priority: value.priority,
      assignee: value.assignee.trim(), dueDate: value.dueDate, tags,
    };
  }
}
