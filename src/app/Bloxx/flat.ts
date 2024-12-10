import { INode } from 'models/node.interface';
import { first } from 'rxjs/operators';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';
import { takeEveryNth } from '../utils/operators';
import { IPerson } from 'models/person.interface';
import { Person } from '../utils/person';

export class Flat {
  public price = 30000;
  public readonly type = 'flat';
  private rent = 500;

  adults = 2;
  kids = 0;
  jobs = 0;

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);
    this.bank.subtractByBlock(this.type);
    this.engine.rentTick$.subscribe(() => this.bank.subtract(this.rent));
    this.engine.add('flat', this);
    this.engine.rentTick$.pipe(takeEveryNth(7), first()).subscribe(() => {
      this.kids = Math.floor(Math.random() * 4);
      this.dom.classList.add('kids-' + this.kids);
      // console.log('kids:', this.kids);
      if (this.kids === 0) {
        this.dom.classList.add('couple');
      } else {
        this.dom.classList.add('family');
      }
    });
  }
}
