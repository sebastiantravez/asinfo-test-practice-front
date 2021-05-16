import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesupervisorComponent } from './employeesupervisor.component';

describe('EmployeesupervisorComponent', () => {
  let component: EmployeesupervisorComponent;
  let fixture: ComponentFixture<EmployeesupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesupervisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
