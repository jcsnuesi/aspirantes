import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarPorGruposComponent } from './actualizar-por-grupos.component';

describe('ActualizarPorGruposComponent', () => {
  let component: ActualizarPorGruposComponent;
  let fixture: ComponentFixture<ActualizarPorGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarPorGruposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarPorGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
