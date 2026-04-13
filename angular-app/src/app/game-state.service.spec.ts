import { TestBed } from '@angular/core/testing';
import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameStateService]
    });
    service = TestBed.inject(GameStateService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should reset state to initial values', () => {
    service.state.set({ ...service.state(), coffee: 100, totalCoffee: 100 });
    service.reset();
    expect(service.state().coffee).toBe(0);
    expect(service.state().totalCoffee).toBe(0);
  });
});
