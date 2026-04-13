import { TestBed } from '@angular/core/testing';
import { SaveLoadService } from './save-load.service';

describe('SaveLoadService', () => {
  let service: SaveLoadService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [SaveLoadService]
    });
    service = TestBed.inject(SaveLoadService);
  });

  it('should save and load a string', () => {
    service.save('test-state');
    expect(service.load()).toBe('test-state');
  });

  it('should clear saved state', () => {
    service.save('test-state');
    service.clear();
    expect(service.load()).toBeNull();
  });
});
