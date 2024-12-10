import { INode } from 'models/node.interface';
import { takeWhile } from 'rxjs/operators';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';
import { Attractions } from './attractions';
import { Flat } from './flat';
import { Office } from './office';
import { Safety } from './safety';
import { School } from './school';
import { Shopping } from './shopping';
import { Stairs } from './stairs';

export class Unit {
  private reachable = false;
  public tenant!:
    | Stairs
    | Office
    | Attractions
    | Flat
    | Safety
    | School
    | Shopping;
  public readonly type = 'unit';
  public name: string = '';
  constructor(
    public node: INode,
    public dom: HTMLDivElement,
    private bank: BankService,
    private engine: GameService
  ) {
    this.name = this.type + '-' + this.node.floor + '-' + this.node.id;
    // this.dom.style.backgroundImage = 'url("assets/img/icon/unit.png")';
    this.bank.subtractByBlock(this.type);
    this.dom.classList.add(this.type);

    this.engine.tick$.pipe(takeWhile((val) => !this.reachable)).subscribe(
      () => this.draw(),
      (err) => console.error(err),
      () => console.log('done')
    );
  }

  draw() {
    if (!this.engine.isConnected(this.node.floor)) {
      this.dom.classList.add('no-connection');
      this.reachable = false;
    } else {
      this.dom.classList.remove('no-connection');
      this.reachable = true;
    }
  }
}
