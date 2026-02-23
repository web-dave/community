import { Injectable } from '@angular/core';
import { IBloxx } from 'models/bloxx.interface';
import { BehaviorSubject } from 'rxjs';

export const prizes: { [key: string]: number } = {
  unit: 500,
  elevator: 300,
  flat: 3000,
  office: 5000,
  shopping: 15000,
  school: 7500,
  safety: 7500,
  attractions: 500,
  fun: 500,
};

@Injectable({
  providedIn: 'root',
})
export class BankService {
  private balance = 35000;
  private bankAccount$$ = new BehaviorSubject<number>(this.balance);
  bankAccount$ = this.bankAccount$$.asObservable();

  isAffordable(block: IBloxx): boolean {
    if (!prizes[block]) {
      return false;
    }

    return this.balance - prizes[block] >= 1;
  }
  subtractByBlock(block: IBloxx) {
    if (prizes[block]) {
      const amount = prizes[block];
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

  getBalance(): number {
    return this.balance;
  }

  setBalance(amount: number) {
    this.balance = amount;
    this.bankAccount$$.next(this.balance);
  }
}
