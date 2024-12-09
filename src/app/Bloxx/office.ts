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
  private background = `url("assets/img/icon/unit.png"), url("assets/img/icon/office.png")`;

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.style.backgroundImage = this.background;
    this.bank.subtractByBlock(this.type);
    this.engine.rentTick$.subscribe(() => {
      this.bank.subtract(this.rent);
      this.bank.add((this.jobs - this.jobFree) * this.salary);
      this.cleanOrDity();
    });
    this.engine.manage.addOffice(this);
    this.dom.classList.add('jobsFree-3');
  }

  getEmployee() {
    this.jobFree -= 1;
    this.dom.classList.remove('jobsFree-3');
    this.dom.classList.remove('jobsFree-2');
    this.dom.classList.remove('jobsFree-1');
    this.dom.classList.remove('jobsFree-0');
    this.dom.classList.add('jobsFree-' + this.jobFree);
    this.cleanOrDity();
  }

  cleanOrDity() {
    if (this.jobFree === 3) {
      this.vacant++;
    } else {
      this.vacant = 0;
    }
    if (this.vacant >= 3) {
      this.dom.style.backgroundImage =
        this.background + ', url("assets/img/icon/dirt.png")';
    } else {
      this.dom.style.backgroundImage = this.background;
    }
  }
}
