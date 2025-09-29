import { INode } from 'models/node.interface';
import { takeWhile } from 'rxjs/operators';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';
import { Attractions } from './attractions';
import { Flat } from './flat';
import { Office } from './office';
import { Safety } from './safety';
import { School } from './school';
import { Shopping } from './shopping';
import { Elevator } from './elevator';

export class Unit {
  public readonly type = 'unit';
  public price = prizes[this.type];

  private reachable = false;
  public id = new Date().getTime();
  public tenant:
    | Elevator
    | Office
    | Attractions
    | Flat
    | Safety
    | School
    | Shopping
    | undefined;
  public name: string = '';
  constructor(
    public node: INode,
    public dom: HTMLDivElement,
    private bank: BankService,
    private engine: GameService
  ) {
    this.name = this.type + '-' + this.node.floor + '-' + this.node.id;
    this.bank.subtract(this.price);
    // this.dom.classList.add(this.type);

    this.engine.tick$
      .pipe(takeWhile((val) => !this.reachable))
      .subscribe(() => this.draw());

    this.engine.add(this.type, this);
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
