import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryHistoryPage } from './query-history.page';

const routes: Routes = [{ path: '', component: QueryHistoryPage }];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class QueryHistoryPageRoutingModule {}
