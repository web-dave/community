import { INode } from 'models/node.interface';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';

export class Attractions {
  public readonly type = 'attractions';
  public price = prizes[this.type];
  public id = new Date().getTime();
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);
    this.bank.subtract(this.price);
    this.engine.add('attractions', this);
  }
}
