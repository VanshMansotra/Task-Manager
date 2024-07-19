import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable,of } from 'rxjs';
import { Task, TaskState } from './tasks.model';
import * as TaskActions from './store/task.action';
import { selectAllTasks } from './store/task.selectors';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { TaskService } from './task.service'; 

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
  constructor(private store: Store<{ tasks: Task[] }>, private taskService: TaskService) {
    this.tasks$ = store.select(selectAllTasks);
  }

  ngOnInit(): void {
    // Load tasks from local storage on initialization
    const tasks = this.taskService.getTasks();
    tasks.forEach(task => this.store.dispatch(TaskActions.addTask({ task })));
  }

  // addTask() {
  //   if (this.newTask.title && this.newTask.description && this.newTask.dueDate) {
  //     const newTask = { ...this.newTask, id: Date.now() };
  //     this.store.dispatch(TaskActions.addTask({ task: newTask }));
  //     this.saveTasksToLocalStorage();
  //     this.resetForm();
  //   } else {
  //     alert('Please fill in all fields.');
  //   }
  // }
  addTask() {
    if (!this.newTask.title || !this.newTask.description || !this.newTask.dueDate || !this.newTask.priority) {
      alert('Please fill in all the details.');
      return;
    }
    if (typeof this.newTask.dueDate === 'string') {
      this.newTask.dueDate = new Date(this.newTask.dueDate);
    }
    if (this.isEditing) {
      this.store.dispatch(TaskActions.editTask({ id: this.newTask.id, task: this.newTask }));
    } else {
      const newTask = { ...this.newTask, id: Date.now() };
      this.store.dispatch(TaskActions.addTask({ task: newTask }));
    }
    this.saveTasksToLocalStorage();
    this.resetForm();
  }

  // editTask(task: Task) {
  //   this.newTask = { 
  //     ...task, 
  //     dueDate: new Date(task.dueDate)  // Ensure dueDate is converted to Date
  //   };
  // }
  editTask(task: Task) {
    this.newTask = { ...task, dueDate: new Date(task.dueDate) }; // Ensure dueDate is a Date object
    this.isEditing = true;
  }
  deleteTask(id: number) {
    this.store.dispatch(TaskActions.deleteTask({ id }));
    this.saveTasksToLocalStorage();
  }

  updateTaskStatus(task: Task) {
    this.store.dispatch(TaskActions.updateTaskStatus({ id: task.id, status: task.status }));
    this.saveTasksToLocalStorage();
  }
  changeTaskStatus(task: Task, status: 'To-Do' | 'In-Progress' | 'Completed') {
    // Create a new task object with the updated status
    const updatedTask = { ...task, status };
    
    // Dispatch the action with the updated task
    this.store.dispatch(TaskActions.updateTaskStatus({ id: task.id, status: updatedTask.status }));
    
    // Save the updated tasks to local storage
    this.saveTasksToLocalStorage();
  }
  

  // changeTaskStatus(task: Task, status: 'To-Do' | 'In-Progress' | 'Completed') {
  //   const updatedTask = { ...task, status };
  //   this.store.dispatch(TaskActions.updateTaskStatus({ id: task.id, status: updatedTask.status }));
  //   this.saveTasksToLocalStorage();
  // }
  

  sortTasks(event: Event) {
    const criteria = (event.target as HTMLSelectElement).value;
    this.tasks$.pipe(take(1)).subscribe(tasks => {
      const sortedTasks = [...tasks];
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

  getFormattedDate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString().substring(0, 10);
    } else {
      return new Date(date).toISOString().substring(0, 10);
    }
  }

  private resetForm() {
    this.newTask = { id: 0, title: '', description: '', dueDate: new Date(), priority: 'Low', status: 'To-Do' };
  }

  private saveTasksToLocalStorage() {
    this.tasks$.pipe(take(1)).subscribe(tasks => {
      this.taskService.saveTasks(tasks);
    });
  }
  downloadCSV() {
    this.tasks$.pipe(take(1)).subscribe(tasks => {
      const csvData = this.convertToCSV(tasks);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', url);
      downloadLink.setAttribute('download', 'tasks.csv');
      downloadLink.style.visibility = 'hidden';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
  private convertToCSV(tasks: Task[]): string {
    const header = ['ID', 'Title', 'Description', 'Due Date', 'Priority', 'Status'];
    const rows = tasks.map(task => [
      task.id,
      task.title,
      task.description,
      this.formatDate(task.dueDate), // Use a helper function to format the date
      task.priority,
      task.status
    ]);
  
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    return csvContent;
  }
  
  private formatDate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString().substring(0, 10);
    } else {
      return new Date(date).toISOString().substring(0, 10);
    }
  }
}
