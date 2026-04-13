import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine/game-engine.service';

describe('GameEngineService', () => {
  let service: GameEngineService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [GameEngineService]
    });
    service = TestBed.inject(GameEngineService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should buy an upgrade when coffee is sufficient', () => {
    service.state.set({ ...service.state(), coffee: 100, totalCoffee: 100 });

    const success = service.buyUpgrade('upgrade1');

    expect(success).toBe(true);
    expect(service.state().upgrades.upgrade1.owned).toBe(1);
    expect(service.state().coffee).toBeLessThan(100);
  });
});
