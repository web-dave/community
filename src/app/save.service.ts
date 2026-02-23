import { Injectable } from '@angular/core';

export interface IPlacement {
  floor: number;
  node: number;
  tenant: string | null;
}

export interface ISaveData {
  balance: number;
  placements: IPlacement[];
}

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  private readonly SAVE_KEY = 'community-save';

  hasSave(): boolean {
    return !!localStorage.getItem(this.SAVE_KEY);
  }

  save(data: ISaveData): void {
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
  }

  load(): ISaveData | null {
    const raw = localStorage.getItem(this.SAVE_KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (
        typeof data?.balance !== 'number' ||
        !Array.isArray(data?.placements)
      ) {
        return null;
      }
      return data as ISaveData;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.SAVE_KEY);
  }
}
