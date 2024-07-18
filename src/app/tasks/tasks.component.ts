import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Task } from './tasks.model';
import * as TaskActions from './store/task.action';
import { selectAllTasks } from './store/task.selectors';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks$: Observable<Task[]>;
  newTask: Task = { id: 0, title: '', description: '', dueDate: new Date(), priority: 'Low', status: 'To-Do' };
  isEditing: boolean = false;

  constructor(private store: Store<{ tasks: Task[] }>) {
    this.tasks$ = store.select(selectAllTasks);
  }

  ngOnInit(): void {
    // Optionally, dispatch an action to load initial tasks
    // this.store.dispatch(TaskActions.loadTasks());
  }

  addTask() {
    if (!this.newTask.title || !this.newTask.description || !this.newTask.dueDate || !this.newTask.priority) {
      alert('Please fill in all the details.');
      return;
    }
  
    if (this.isEditing) {
      this.store.dispatch(TaskActions.editTask({ id: this.newTask.id, task: this.newTask }));
    } else {
      const newTask = { ...this.newTask, id: Date.now() };
      this.store.dispatch(TaskActions.addTask({ task: newTask }));
    }
  
    this.resetForm();
  }

  editTask(task: Task) {
    this.newTask = { ...task, dueDate: new Date(task.dueDate) }; // Ensure dueDate is a Date object
    this.isEditing = true;
  }

  deleteTask(id: number) {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }

  changeTaskStatus(task: Task, status: string) {
    this.store.dispatch(TaskActions.updateTaskStatus({ id: task.id, status: status as 'To-Do' | 'In-Progress' | 'Completed' }));
  }

  sortTasks(event: Event) {
    const criteria = (event.target as HTMLSelectElement).value;
    this.tasks$.pipe(take(1)).subscribe(tasks => {
      const sortedTasks = [...tasks]; // Create a new array
      switch (criteria) {
        case 'dueDate':
          sortedTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
          break;
        case 'priority':
          const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
          break;
        case 'status':
          const statusOrder = { 'To-Do': 1, 'In-Progress': 2, 'Completed': 3 };
          sortedTasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
          break;
        default:
          break;
      }
      this.tasks$ = of(sortedTasks);
    });
  }

  private resetForm() {
    this.newTask = { id: 0, title: '', description: '', dueDate: new Date(), priority: 'Low', status: 'To-Do' };
    this.isEditing = false;
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
