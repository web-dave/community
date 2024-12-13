import { INode } from 'models/node.interface';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';

export class Stairs {
  public readonly type = 'stairs';
  public price = prizes[this.type];
  public id = new Date().getTime();

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);
    this.engine.connectFloor(this.node.floor);
    this.bank.subtract(this.price);
  }
}
