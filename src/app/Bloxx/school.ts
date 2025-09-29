import { INode } from 'models/node.interface';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';
import { Flat } from './flat';

export class School {
  public readonly type = 'school';
  public price = prizes[this.type];
  public id = new Date().getTime();
  maxNumberOfKids = 15;
  kids: Flat[] = [];
  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    // this.dom.classList.add(this.type);
    this.bank.subtract(this.price);
    this.engine.add('school', this);
  }

  getKid(flat: Flat) {
    this.kids.push(flat);
    this.checkKidsStaus();
  }

  leave(flat: Flat) {
    const index = this.kids.map((f) => f.id).indexOf(this.id);
    this.kids.splice(index, 1);
    this.checkKidsStaus();
  }

  checkKidsStaus() {
    const numberOfKids = this.kids.length;
    let freeSeats = 0;
    this.dom.classList.remove('jobsFree-15');
    this.dom.classList.remove('jobsFree-10');
    this.dom.classList.remove('jobsFree-5');
    this.dom.classList.remove('jobsFree-0');
    if (numberOfKids === 0) {
      freeSeats = 15;
    } else if (numberOfKids <= 5) {
      freeSeats = 10;
    } else if (numberOfKids <= 10) {
      freeSeats = 5;
    } else if (numberOfKids === 15) {
      freeSeats = 0;
    }
    this.dom.classList.add('seatsFree-' + freeSeats);
  }
}
