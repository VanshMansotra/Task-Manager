import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Task } from './tasks.model.js';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add FormsModule here
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  tasks: Task[] = [];
  newTask: Task = this.resetNewTask();
  sortCriteria: string = 'dueDate';

  resetNewTask(): Task {
    return {
      id: Date.now(),
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'Low',
      status: 'To-Do'
    };
  }

  addTask() {
    if (this.newTask.title && this.newTask.description && this.newTask.dueDate && this.newTask.priority) {
      this.newTask.id = Date.now();
      this.tasks.push({ ...this.newTask });
      this.newTask = this.resetNewTask();
    }
  }

  editTask(task: Task) {
    this.newTask = { ...task };
    this.deleteTask(task.id);
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  updateTaskStatus(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index].status = task.status;
    }
  }

  sortTasks(event: Event) {
    const criteria = (event.target as HTMLSelectElement).value;
    this.sortCriteria = criteria;
    if (criteria === 'dueDate') {
      this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (criteria === 'priority') {
      const priorityOrder = { 'Low': 0, 'Medium': 1, 'High': 2 };
      this.tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (criteria === 'status') {
      const statusOrder = { 'To-Do': 0, 'In-Progress': 1, 'Completed': 2 };
      this.tasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }
  }  
}
