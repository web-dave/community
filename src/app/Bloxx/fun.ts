import { INode } from 'models/node.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';
import { takeEveryNth } from '../utils/operators';

export class Fun {
  public readonly type = 'fun';
  public price = prizes[this.type];
  public id = new Date().getTime();
  public maxCapacity = 50;
  private entryFee = 50;
  private crimeCounter = 0;
  private terminator$$ = new Subject<number>();

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);
    this.bank.subtract(this.price);

    // Families with children visit every 8 time units and pay the entry fee
    this.engine.tick$
      .pipe(takeEveryNth(8), takeUntil(this.terminator$$))
      .subscribe(() => {
        let currentPersons = 0;
        this.engine.manage.flats
          .filter((flat) => flat.kids > 0)
          .forEach((flat) => {
            const persons = flat.adults + flat.kids;
            if (currentPersons + persons <= this.maxCapacity) {
              currentPersons += persons;
              this.bank.add(this.entryFee);
            }
          });
      });

    // Close if more than 3 crimes exist for 4 consecutive time units
    this.engine.tick$.pipe(takeUntil(this.terminator$$)).subscribe(() => {
      const crimeCount = this.engine.manage.flats.filter(
        (f) => f.safeties.length === 0
      ).length;
      if (crimeCount > 3) {
        this.crimeCounter++;
      } else {
        this.crimeCounter = 0;
      }
      if (this.crimeCounter >= 4) {
        this.engine.destroy(this.type, this);
      }
    });

    this.engine.add('fun', this);
  }

  destroy() {
    this.terminator$$.next(1);
    this.terminator$$.complete();
    this.dom.classList.remove('fun');
  }
}
