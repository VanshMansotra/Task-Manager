// src/app/tasks/store/task.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TaskState } from '../tasks.model';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);
