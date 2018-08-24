import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyDashboardDialogComponent } from './copy-dashboard-dialog.component';

describe('CopyDashboardDialogComponent', () => {
  let component: CopyDashboardDialogComponent;
  let fixture: ComponentFixture<CopyDashboardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyDashboardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDashboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
