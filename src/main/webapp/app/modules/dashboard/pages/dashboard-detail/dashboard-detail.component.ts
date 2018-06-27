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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

import {DashboardService} from '../../dashboard.service';
import {Project} from '../../../../shared/model/dto/Project';
import {AddWidgetDialogComponent} from '../../../../layout/header/components/add-widget-dialog/add-widget-dialog.component';
import {DashboardRotationComponent} from '../components/dashboard-rotation/dashboard-rotation.component';
import {ProjectType} from '../../../shared/model/dto/enums/ProjectType';

/**
 * Component that display a specific dashboard
 */
@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.css']
})
export class DashboardDetailComponent implements OnInit, OnDestroy {

  /**
   * The widget dialog ref
   * @type {MatDialogRef<AddWidgetDialogComponent>}
   * @private
   */
  private addWidgetDialogRef: MatDialogRef<AddWidgetDialogComponent>;

  /**
   * Tell if the component is displayed
   * @type {boolean}
   * @private
   */
  private isAlive = true;

  /**
   * The project as observable
   * @type {Observable<Project>}
   */
  project$: Observable<Project>;

    /**
     * The current project id
     */
  projectId;

  /**
   * Child Projects as observables
   */
  childs: Project[];

    /**
     * Project type enum reference
     * @type {ProjectType}
     */
  projectType = ProjectType;

    /**
     * The dashboard rotation
     * @type {DashboardRotationComponent}
     */
    @ViewChild(DashboardRotationComponent) dashboardRotation: DashboardRotationComponent;

  /**
   * constructor
   *
   * @param {ActivatedRoute} activatedRoute The activated route service
   * @param {DashboardService} dashboardService The dashboard service
   * @param {MatDialog} matDialog The mat dialog service
   */
  constructor(private activatedRoute: ActivatedRoute,
              private dashboardService: DashboardService,
              private matDialog: MatDialog) {
  }

  /**
   * Init objects
   */
  ngOnInit() {
    // Global init from project
    this.activatedRoute.params.subscribe(params => {
      this.dashboardService
          .getOneById(+params['id'])
          .subscribe(project => {
            this.dashboardService.currentDisplayedDashboardValue = project;
          });
    });

    this.dashboardService.currentDisplayedDashboard$
        .pipe(takeWhile(() => this.isAlive))
        .subscribe(project => {
            this.project$ = of(project);
            if(project != null) {
                this.projectId = project.id;
            }
        });

    this.activatedRoute.params.subscribe(params => this.projectId = params['id']);
    this.childs = this.dashboardService.getSlidesByParentId(this.projectId);

      this.dashboardService
          .dashboardsSubject
          .pipe(takeWhile(() => this.isAlive))
          .subscribe(projects => {
              this.childs = this.dashboardService.getSlidesByParentId(this.projectId);
          });


    // this.dashboardService
    //     .currentSlideSubject
    //     .pipe(takeWhile(() => this.isAlive))
    //     .subscribe(currentSlide => {
    //       //   console.log('SERVICE CALLED');
    //       // if (currentSlide !== null) {
    //       //     let index = this.findChildWithId(this.childs, currentSlide.id);
    //       //     console.log('CURRENT SLIDE : ' + currentSlide.name + ' (index ' + index + ')');
    //       //     this.childs[index] = currentSlide;
    //       //     this.dashboardRotation.slideName.nativeElement.innerHTML = currentSlide.name;
    //       //     this.dashboardRotation.slideCircles.nativeElement.children[index].nativeElement.src = '../../../../assets/images/current-slide-blue.png';
    //       //     index = this.findChildWithId(this.dashboardService.dashboardsSubject, currentSlide.id);
    //       //     this.dashboardService.dashboardsSubject[index] = currentSlide;
    //       //     console.log('DONE');
    //       // }
    //     });
  }

    this.dashboardService
        .currentSlideSubject
        .pipe(takeWhile(() => this.isAlive))
        .subscribe((project) => {
            if (project) {
                console.log("SLIDE : " + project.name);
            }
        });
  }



  //
  //   get refreshFunc() {
  //       return this.refresh.bind(this);
  //   }
  //
  // refresh() {
  //   //this.childs = this.dashboardService.getSlidesByParentId(this.projectId);
  //   //this.dashboardRotation.updateCarouselSize();
  // }


  /**
   * The add widget dialog ref
   */
  openAddWidgetDialog() {
    this.addWidgetDialogRef = this.matDialog.open(AddWidgetDialogComponent, {
      minWidth: 900,
      minHeight: 500,
    });
  }

  /**
   * When the component is destroyed
   */
  ngOnDestroy() {
    this.isAlive = false;
  }

}
