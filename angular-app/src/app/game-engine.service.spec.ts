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

  it('should export and import state successfully', () => {
    service.state.set({ ...service.state(), coffee: 150, totalCoffee: 150 });
    const exported = service.exportState();

    service.reset();
    expect(service.state().coffee).toBe(0);

    service.importState(exported);
    expect(service.state().coffee).toBe(150);
    expect(service.state().totalCoffee).toBe(150);
  });

  it('should clear saved state without error', () => {
    service.state.set({ ...service.state(), coffee: 125, totalCoffee: 125 });
    service.exportState();
    service.clearSavedState();
    expect(service.state().coffee).toBe(125);
  });

  it('should unlock Thursday mode and apply a multiplier', () => {
    expect(service.state().thursdayModeUnlocked).toBe(false);
    service.unlockThursdayMode();
    expect(service.state().thursdayModeUnlocked).toBe(true);
    expect(service.state().cpsMultiplier).toBeGreaterThan(1.0);
  });

  it('should advance narrative dialogue index', () => {
    service.state.set({ ...service.state(), currentDialogueIndex: 0 });
    service.advanceDialogue();
    expect(service.state().currentDialogueIndex).toBe(1);
  });

  it('should add a new achievement', () => {
    service.addAchievement('First sip');
    expect(service.state().achievements).toContain('First sip');
  });
});
