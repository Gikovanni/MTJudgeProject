import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { QueryHistoryPageRoutingModule } from './query-history-routing.module';
import { QueryHistoryPage } from './query-history.page';

@NgModule({ declarations: [QueryHistoryPage], imports: [CommonModule, IonicModule, RouterModule, QueryHistoryPageRoutingModule] })
export class QueryHistoryPageModule {}
