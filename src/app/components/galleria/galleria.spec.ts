import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Galleria } from './galleria';

describe('Galleria', () => {
  let component: Galleria;
  let fixture: ComponentFixture<Galleria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Galleria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Galleria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
