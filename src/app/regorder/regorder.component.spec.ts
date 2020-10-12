import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegorderComponent } from './regorder.component';

describe('RegorderComponent', () => {
  let component: RegorderComponent;
  let fixture: ComponentFixture<RegorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
