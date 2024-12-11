import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';

export class Safety {
  public price = 75000;
  public readonly type = 'safety';
  public id = new Date().getTime();
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);
    this.bank.subtract(this.price);
    this.engine.add('safety', this);
  }
}
