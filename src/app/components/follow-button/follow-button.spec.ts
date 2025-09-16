import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowButton } from './follow-button';

describe('FollowButton', () => {
  let component: FollowButton;
  let fixture: ComponentFixture<FollowButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
