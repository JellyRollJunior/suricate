/*
 * Copyright 2012-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from '../../shared/guards/auth.guard';
import {DashboardService} from '../../shared/services/dashboard.service';
import { DashboardDetailComponent } from './pages/dashboard-detail/dashboard-detail.component';

const dashboardRoutes: Routes = [
  { path: 'dashboard/:id', component: DashboardDetailComponent, data: { breadcrumb: 'Dashboard detail' }, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
      RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
      RouterModule
  ],
  providers: [
      DashboardService
  ]
})
export class DashboardModule {}