import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SprintTask, TaskInput } from '../domain/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/tasks';

  getTasks(): Observable<SprintTask[]> {
    return this.http.get<SprintTask[]>(this.baseUrl);
  }

  getTaskById(id: string): Observable<SprintTask> {
    return this.http.get<SprintTask>(`${this.baseUrl}/${id}`);
  }

  createTask(input: TaskInput): Observable<SprintTask> {
    return this.http.post<SprintTask>(this.baseUrl, input);
  }

  updateTask(id: string, input: TaskInput): Observable<SprintTask> {
    return this.http.put<SprintTask>(`${this.baseUrl}/${id}`, input);
  }
}
