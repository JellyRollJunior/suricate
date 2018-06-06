import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRotationComponent } from './dashboard-rotation.component';

describe('DashboardRotationComponent', () => {
  let component: DashboardRotationComponent;
  let fixture: ComponentFixture<DashboardRotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
