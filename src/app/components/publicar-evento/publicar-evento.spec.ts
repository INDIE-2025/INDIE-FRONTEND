import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicarEvento } from './publicar-evento';

describe('PublicarEvento', () => {
  let component: PublicarEvento;
  let fixture: ComponentFixture<PublicarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicarEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicarEvento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
