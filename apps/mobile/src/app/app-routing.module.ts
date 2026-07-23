import { NgModule } from '@angular/core'; import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'rules/:id', loadChildren: () => import('./features/rule-detail/rule-detail.module').then(m => m.RuleDetailPageModule) },
  { path: 'history', loadChildren: () => import('./features/query-history/query-history.module').then(m => m.QueryHistoryPageModule) },
  { path: 'performance', loadChildren: () => import('./features/search-performance/search-performance.module').then(m => m.SearchPerformancePageModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
@NgModule({ imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })], exports: [RouterModule] }) export class AppRoutingModule {}
