// src/app/tasks/store/task.actions.ts
import { createAction, props } from '@ngrx/store';
import { Task } from '../tasks.model';

export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: Task }>()
);

export const editTask = createAction(
  '[Task] Edit Task',
  props<{ id: number, task: Task }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: number }>()
);

export const updateTaskStatus = createAction(
  '[Task] Update Task Status',
  props<{ id: number, status: 'To-Do' | 'In-Progress' | 'Completed' }>()
);
