import { INode } from 'models/node.interface';
import { first } from 'rxjs/operators';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';
import { takeEveryNth } from '../utils/operators';

export class Flat {
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
    this.dom.style.backgroundImage = `url("assets/img/icon/unit.png"), url("assets/img/icon/${this.type}.png")`;
    this.bank.subtractByBlock(this.type);
    this.engine.rentTick$.subscribe(() => this.bank.subtract(this.rent));
    this.engine.manage.addTenant(this);
    this.engine.rentTick$.pipe(takeEveryNth(7), first()).subscribe(() => {
      this.kids = Math.floor(Math.random() * 4);
    });
  }
}
