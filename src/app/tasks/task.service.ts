import { Injectable } from '@angular/core';
import { Task } from './tasks.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private storageKey = 'tasks';

  constructor() {}

  getTasks(): Task[] {
    const tasks = localStorage.getItem(this.storageKey);
    return tasks ? JSON.parse(tasks) : [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}
