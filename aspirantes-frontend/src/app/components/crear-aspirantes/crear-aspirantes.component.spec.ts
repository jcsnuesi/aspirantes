import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAspirantesComponent } from './crear-aspirantes.component';

describe('CrearAspirantesComponent', () => {
  let component: CrearAspirantesComponent;
  let fixture: ComponentFixture<CrearAspirantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearAspirantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAspirantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
