import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';

export class Flat {
  public readonly type = 'flat';
  private rent = 500;
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.style.backgroundImage = `url("assets/img/icon/unit.png"), url("assets/img/icon/${this.type}.png")`;
    this.bank.subtractByBlock(this.type);
    engine.rentTick$.subscribe(() => this.bank.subtract(this.rent));
  }
}
