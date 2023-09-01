import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorarCodigosComponent } from './explorar-codigos.component';

describe('ExplorarCodigosComponent', () => {
  let component: ExplorarCodigosComponent;
  let fixture: ComponentFixture<ExplorarCodigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplorarCodigosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorarCodigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
