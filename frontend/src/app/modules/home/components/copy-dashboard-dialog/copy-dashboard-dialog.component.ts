import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Project} from '../../../../shared/model/dto/Project';
import {takeWhile} from 'rxjs/operators';
import {DashboardService} from '../../../dashboard/dashboard.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatHorizontalStepper} from '@angular/material';
import {AddWidgetDialogComponent} from '../../../../shared/components/pages-header/components/add-widget-dialog/add-widget-dialog.component';
import {ProjectType} from '../../../../shared/model/dto/enums/ProjectType';
import {ProjectWidget} from '../../../../shared/model/dto/ProjectWidget';
import {forEach} from '@angular/router/src/utils/collection';
import {Router} from '@angular/router';

@Component({
  selector: 'app-copy-dashboard-dialog',
  templateUrl: './copy-dashboard-dialog.component.html',
  styleUrls: ['./copy-dashboard-dialog.component.css']
})
export class CopyDashboardDialogComponent implements OnInit {

  /**
   * The list of dashboards
   */
  dashboards: Project[];

  /**
   * New project
   */
  projectAdded: Project;

    /**
     * Title of the dialog box
     */
    @ViewChild('title') title: ElementRef;

    /**
     * Subtitle of the dialog box
     */
    @ViewChild('subtitle') subtitle: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private router: Router,
              private dashboardService: DashboardService,
              private changeDetectorRef: ChangeDetectorRef,
              private copyDashboardDialogRef: MatDialogRef<CopyDashboardDialogComponent>
              ) { }

  ngOnInit() {
      this.dashboardService
          .dashboardsSubject
          .subscribe( dashboards => this.dashboards = this.dashboardService.sortByProjectName(this.dashboardService.getAllSlideshowsExceptCurrent(dashboards)));
      if (this.dashboardService.currendDashbordSubject.getValue().projectType === ProjectType.SLIDESHOW) {
          this.title.nativeElement.innerHTML = 'Copy slide';
          this.subtitle.nativeElement.innerHTML = 'Copy slide to ...';
      } else {
          this.title.nativeElement.innerHTML = 'Copy dashboard';
          this.subtitle.nativeElement.innerHTML = 'Copy dashboard to ...';
      }
  }

  createClassicDashboard() {
    if (this.data && this.data.projectId) {
      this.dashboardService
          .getOneById(+this.data.projectId)
          .subscribe(oldProject => {
              this.projectAdded = oldProject;
              this.projectAdded.id = undefined;
              this.projectAdded.projectType = ProjectType.DEFAULT;
              this.projectAdded.name = this.projectAdded.name + ' (copy)';
              this.projectAdded.token = undefined;
              this.dashboardService
                  .createProject(this.projectAdded)
                  .subscribe((newProject) => {
                      this.copyWidgets(oldProject, newProject);
                      this.displayProject(newProject);
                      this.copyDashboardDialogRef.close();
                  });
          });
    }
  }

  copyWidgets(oldProject, newProject) {
      oldProject.projectWidgets.forEach( (initialWidget) => {
          const projectWidget: ProjectWidget = initialWidget;
          projectWidget.id = undefined;
          projectWidget.project = newProject;
          this.dashboardService
              .addWidgetToProject(projectWidget)
              .subscribe();
      });
  }

  copyToDashboardSlide(slideshowDestinationId) {
      if (this.data && this.data.projectId) {
          this.dashboardService
              .getOneById(+this.data.projectId)
              .subscribe(oldProject => {
                  this.projectAdded = oldProject;
                  this.projectAdded.id = undefined;
                  this.projectAdded.parent = new Project();
                  this.projectAdded.parent.id = slideshowDestinationId;
                  this.projectAdded.projectType = ProjectType.SLIDE;
                  this.projectAdded.token = undefined;
                  this.dashboardService
                      .createProject(this.projectAdded)
                      .subscribe((newProject) => {
                          this.copyWidgets(oldProject, newProject);
                          this.dashboardService
                                  .getOneById(slideshowDestinationId)
                                  .subscribe(slideshow => {
                                      this.displayProject(slideshow);
                                      this.copyDashboardDialogRef.close();
                                  });
                      });
              });
      }
  }

  displayProject(project: Project) {
      this.projectAdded = project;
      this.changeDetectorRef.detectChanges();
      this.dashboardService.currendDashbordSubject.next(project);
      this.router.navigate(['/dashboard/' + project.id]);
  }


}
