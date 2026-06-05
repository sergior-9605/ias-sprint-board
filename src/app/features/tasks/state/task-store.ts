import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { TaskApi } from '../data-access/task-api';
import {
  SprintTask,
  TaskInput,
  TaskPriorityFilter,
  TaskStatusFilter,
} from '../domain/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  private readonly api = inject(TaskApi);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _tasks = signal<SprintTask[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _search = signal('');
  private readonly _status = signal<TaskStatusFilter>('all');
  private readonly _priority = signal<TaskPriorityFilter>('all');
  private readonly _selectedId = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly search = this._search.asReadonly();
  readonly status = this._status.asReadonly();
  readonly priority = this._priority.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();

  readonly filteredTasks = computed(() => {
    const term = this._search().trim().toLowerCase();
    const status = this._status();
    const priority = this._priority();
    return this._tasks().filter((task) => {
      const matchesText =
        term === '' ||
        task.title.toLowerCase().includes(term) ||
        task.assignee.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || task.status === status;
      const matchesPriority = priority === 'all' || task.priority === priority;
      return matchesText && matchesStatus && matchesPriority;
    });
  });

  readonly selectedTask = computed(
    () => this._tasks().find((task) => task.id === this._selectedId()) ?? null,
  );

  readonly summary = computed(() => {
    const tasks = this._tasks();
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const blocked = tasks.filter((t) => t.status === 'blocked').length;
    const open = total - done - blocked;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, open, blocked, done, progress };
  });

  readonly isEmpty = computed(() => !this._loading() && this.filteredTasks().length === 0);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.getTasks().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this._loading.set(false)),
    ).subscribe({
      next: (tasks) => this._tasks.set(tasks),
      error: (err: Error) => this._error.set(err.message),
    });
  }

  create(input: TaskInput): Observable<SprintTask> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.createTask(input).pipe(
      tap((created) => this._tasks.update((tasks) => [...tasks, created])),
      catchError((err: Error) => {
        this._error.set(err.message);
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false)),
    );
  }

  update(id: string, input: TaskInput): Observable<SprintTask> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.updateTask(id, input).pipe(
      tap((updated) =>
        this._tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t))),
      ),
      catchError((err: Error) => {
        this._error.set(err.message);
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false)),
    );
  }

  select(id: string | null): void {
    this._selectedId.set(id);
  }

  setSearch(value: string): void {
    this._search.set(value);
  }

  setStatus(value: TaskStatusFilter): void {
    this._status.set(value);
  }

  setPriority(value: TaskPriorityFilter): void {
    this._priority.set(value);
  }
  
  clearFilters(): void {
    this._search.set('');
    this._status.set('all');
    this._priority.set('all');
  }
}
