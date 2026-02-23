import { INode } from 'models/node.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';
import { Flat } from './flat';

export class Shopping {
  public readonly type = 'shopping';
  public price = prizes[this.type];
  public id = new Date().getTime();
  public jobs = 4;
  public jobFree = 4;
  public flats: Flat[] = [];
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
    this.engine.rentTick$.pipe(takeUntil(this.terminator$$)).subscribe(() => {
      if (this.jobFree >= this.jobs / 2) {
        this.crimeCounter++;
        if (this.crimeCounter >= 7) {
          this.dom.classList.add('crime');
        }
      } else {
        this.crimeCounter = 0;
        this.dom.classList.remove('crime');
      }
    });
    this.engine.add('shopping', this);
  }

  getEmployee(flat: Flat) {
    this.jobFree -= 1;
    this.flats.push(flat);
  }

  leave(flat: Flat) {
    const index = this.flats.map((f) => f.id).indexOf(flat.id);
    if (index !== -1) {
      this.flats.splice(index, 1);
    }
    this.jobFree = this.jobs - this.flats.length;
  }

  destroy() {
    this.terminator$$.next(1);
    this.terminator$$.complete();
    this.dom.classList.remove('shopping', 'crime');
    this.flats.forEach((flat) => flat.leaveShoppingJob(this));
    this.flats = [];
  }
}
