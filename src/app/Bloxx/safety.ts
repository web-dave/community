import { INode } from 'models/node.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';
import { Flat } from './flat';

export class Safety {
  public readonly type = 'safety';
  public price = prizes[this.type];
  public id = new Date().getTime();
  public maxCapacity = 100;
  public flats: Flat[] = [];
  private rent = 750;
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
      this.bank.add(this.rent);
    });
    this.engine.add('safety', this);
  }

  get peopleCount(): number {
    return this.flats.reduce((sum, flat) => sum + flat.adults + flat.kids, 0);
  }

  protect(flat: Flat) {
    this.flats.push(flat);
    flat.getASafety(this);
  }

  leave(flat: Flat) {
    const index = this.flats.map((f) => f.id).indexOf(flat.id);
    if (index !== -1) {
      this.flats.splice(index, 1);
    }
  }

  destroy() {
    this.terminator$$.next(1);
    this.terminator$$.complete();
    this.dom.classList.remove('safety');
    this.flats.forEach((flat) => {
      flat.leaveSafety(this);
    });
    this.flats = [];
  }
}
