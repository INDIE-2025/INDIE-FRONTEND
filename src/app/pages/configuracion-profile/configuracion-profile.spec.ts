import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionProfile } from './configuracion-profile';

describe('ConfiguracionProfile', () => {
  let component: ConfiguracionProfile;
  let fixture: ComponentFixture<ConfiguracionProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
