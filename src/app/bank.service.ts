import { Injectable } from '@angular/core';
import { IBloxx } from 'models/bloxx.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  public readonly prizes: { [key: string]: number } = {
    unit: 5000,
    stairs: 3000,
    flat: 30000,
    office: 50000,
    shopping: 150000,
    school: 75000,
    safety: 75000,
    attractions: 5000,
  };
  private balance = 350000;
  private bankAccount$$ = new BehaviorSubject<number>(this.balance);
  bankAccount$ = this.bankAccount$$.asObservable();

  isAffordable(block: IBloxx): boolean {
    if (!this.prizes[block]) {
      return false;
    }
    if (this.balance - this.prizes[block] >= 1) {
      this.subtract(this.prizes[block]);
      return true;
    }
    return false;
  }
  subtractByBlock(block: IBloxx) {
    if (this.prizes[block]) {
      const amount = this.prizes[block];
      this.balance -= amount;
      this.bankAccount$$.next(this.balance);
    }
  }
  subtract(amount: number) {
    this.balance -= amount;
    this.bankAccount$$.next(this.balance);
  }

  add(amount: number) {
    this.balance += amount;
    this.bankAccount$$.next(this.balance);
  }
}
