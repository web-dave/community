import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';

export class Attractions {
  public price = 50000;
  public readonly type = 'attractions';
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);
    this.bank.subtractByBlock(this.type);
    this.engine.add('attractions', this);
  }
}
