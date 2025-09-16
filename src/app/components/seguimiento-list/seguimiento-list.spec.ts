import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoList } from './seguimiento-list';

describe('SeguimientoList', () => {
  let component: SeguimientoList;
  let fixture: ComponentFixture<SeguimientoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
