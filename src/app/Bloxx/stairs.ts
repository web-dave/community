import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';

export class Stairs {
  prize = 500;
  public readonly type = 'stairs';
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);
    this.engine.connectFloor(this.node.floor);
    this.bank.subtractByBlock('stairs');
  }
}
