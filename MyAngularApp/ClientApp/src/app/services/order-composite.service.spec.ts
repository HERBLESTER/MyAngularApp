import { TestBed } from '@angular/core/testing';

import { OrderCompositeService } from './order-composite.service';

describe('OrderCompositeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderCompositeService = TestBed.get(OrderCompositeService);
    expect(service).toBeTruthy();
  });
});
