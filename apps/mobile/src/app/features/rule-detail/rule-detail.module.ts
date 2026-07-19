import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RuleDetailPageRoutingModule } from './rule-detail-routing.module';
import { RuleDetailPage } from './rule-detail.page';

@NgModule({
  declarations: [RuleDetailPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, RuleDetailPageRoutingModule],
})
export class RuleDetailPageModule {}
