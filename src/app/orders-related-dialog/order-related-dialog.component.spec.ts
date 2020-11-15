import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRelatedDialogComponent } from './order-related-dialog.component';

describe('OrderRelatedDialogComponent', () => {
  let component: OrderRelatedDialogComponent;
  let fixture: ComponentFixture<OrderRelatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderRelatedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRelatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
