import { createReducer, on, Action } from '@ngrx/store';
import * as TaskActions from './task.action';
import { Task, TaskState } from '../tasks.model';

export const initialState: TaskState = {
  tasks: []
};

const _taskReducer = createReducer(
  initialState,
  on(TaskActions.addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task]
  })),
  on(TaskActions.editTask, (state, { id, task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === id ? { ...task, id } : t) // Ensure the task ID is retained
  })),
  on(TaskActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  on(TaskActions.updateTaskStatus, (state, { id, status }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)
  }))
);


export function taskReducer(state: TaskState | undefined, action: Action) {
  return _taskReducer(state, action);
}
