import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { Attractions } from './attractions';
import { Flat } from './flat';
import { Office } from './office';
import { Safety } from './safety';
import { School } from './school';
import { Shopping } from './shopping';
import { Stairs } from './stairs';

export class Unit {
  public tenant!:
    | Stairs
    | Office
    | Attractions
    | Flat
    | Safety
    | School
    | Shopping;
  public name: string = '';
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private bank: BankService
  ) {
    this.name = 'unit-' + this.node.floor + '-' + this.node.id;
    this.dom.style.backgroundImage = 'url("assets/img/icon/unit.png")';
    this.bank.subtract('unit');
  }
}
