import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';

export class Stairs {
  prize = 500;
  name = 'stairs';
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.style.backgroundImage = `url("assets/img/icon/unit.png"), url("assets/img/icon/stairs.png")`;
    this.engine.connectFloor(this.node.floor);
    this.bank.subtractByBlock('stairs');
  }
}
