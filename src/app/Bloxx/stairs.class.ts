import { INode } from 'models/node.interface';
import { GameService } from '../game.service';

export class Stairs {
  prize = 500;
  name = 'stairs';
  constructor(
    private node: INode,
    public dom: HTMLDivElement,
    private engine: GameService
  ) {
    this.dom.style.backgroundImage = `url("assets/img/icon/unit.png"), url("assets/img/icon/stairs.png")`;
    this.engine.connectFloor(this.node.floor);
  }
}
