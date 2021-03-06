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
import {Routes} from '@angular/router';
import {UserListComponent} from './user/pages/user-list/user-list.component';
import {AuthGuard} from '../../shared/auth/guards/auth.guard';
import {UserEditComponent} from './user/pages/user-edit/user-edit.component';
import {AdminGuard} from '../../shared/auth/guards/admin.guard';
import {ConfigListComponent} from './config/pages/config-list/config-list.component';

export const securityRoutes: Routes = [
  {path: 'security/users', component: UserListComponent, data: {breadcrumb: 'User List'}, canActivate: [AuthGuard, AdminGuard]},
  {
    path: 'security/users/:userId/edit',
    component: UserEditComponent,
    data: {breadcrumb: 'Edit User'},
    canActivate: [AuthGuard, AdminGuard]
  },
  {path: 'security/config', component: ConfigListComponent, data: {breadcrumb: 'Config'}, canActivate: [AuthGuard, AdminGuard]}
];
