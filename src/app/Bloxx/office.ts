import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';

export class Office {
  public readonly type = 'office';
  private rent = 500;
  private salary = 750;
  public jobs = 3;
  public jobFree = 3;
  public vacant = 0;

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.bank.subtractByBlock(this.type);
    this.dom.classList.add(this.type);
    this.checkEmployeeStaus();
    this.engine.rentTick$.subscribe(() => {
      this.bank.subtract(this.rent);
      this.bank.add((this.jobs - this.jobFree) * this.salary);
      this.cleanOrDity();
    });
    this.engine.manage.addOffice(this);
  }

  getEmployee() {
    this.jobFree -= 1;
    this.checkEmployeeStaus();
    this.cleanOrDity();
  }

  checkEmployeeStaus() {
    this.dom.classList.remove('jobsFree-3');
    this.dom.classList.remove('jobsFree-2');
    this.dom.classList.remove('jobsFree-1');
    this.dom.classList.remove('jobsFree-0');
    this.dom.classList.add('jobsFree-' + this.jobFree);
    console.log('jobsFree-' + this.jobFree, this.dom.classList);
  }

  cleanOrDity() {
    if (this.jobFree === 3) {
      this.vacant++;
    } else {
      this.vacant = 0;
    }
    this.checkEmployeeStaus();
    if (this.vacant >= 3) {
      this.dom.classList.add('dirty');
    } else {
      this.dom.classList.remove('dirty');
    }
  }
}
