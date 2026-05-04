import { Routes } from '@angular/router';
import { featureGuard } from './guard/feature-guard';

export const routes: Routes = [

  {
    path: 'todo-list',
    loadComponent: () => import('./pages/todo-list/todo-list.page').then((m) => m.TodoListPage)
  },
  {
    path: '',
    redirectTo: 'todo-list',
    pathMatch: 'full',
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.page').then( m => m.CategoriesPage)
  },
  {
    path: 'task-list',
    loadComponent: () => import('./component/task-list/task-list/task-list.page').then( m => m.TaskListPage)
  }
];
