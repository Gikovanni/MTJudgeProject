import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuleDetailPage } from './rule-detail.page';

const routes: Routes = [{ path: '', component: RuleDetailPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuleDetailPageRoutingModule {}
