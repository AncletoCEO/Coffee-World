import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveLoadService {
  private readonly storageKey = 'coffee-world-state';

  save(state: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, state);
    }
  }

  load(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.storageKey);
  }

  clear(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}
