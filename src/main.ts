import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AppComponent } from './app/app.component';
import { taskReducer } from './app/tasks/store/task.reducer';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TasksComponent } from './app/tasks/tasks.component';
import { StoreModule } from '@ngrx/store';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ tasks: taskReducer }),
    provideEffects([]), 
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(StoreModule.forRoot({ tasks: taskReducer }))
  ]
})
.catch(err => console.error(err));
