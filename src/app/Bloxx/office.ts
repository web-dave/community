import { INode } from 'models/node.interface';
import { BankService } from '../bank.service';
import { GameService } from '../game.service';

export class Office {
  public readonly type = 'office';
  private rent = 500;
  public jobs = 3;
  public jobFree = 3;

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.style.backgroundImage = `url("assets/img/icon/unit.png"), url("assets/img/icon/${this.type}.png")`;
    this.bank.subtractByBlock(this.type);
    this.engine.rentTick$.subscribe(() => this.bank.subtract(this.rent));
    this.engine.manage.addOffice(this);
  }
}
