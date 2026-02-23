import { INode } from 'models/node.interface';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Flat } from './flat';

export class Office {
  public readonly type = 'office';
  public price = prizes[this.type];
  public id = new Date().getTime();
  private rent = 500;
  private salary = 2500;
  public jobs = 3;
  public jobFree = 3;
  public vacant = 0;
  private terminator$$ = new Subject<number>();
  flats: Flat[] = [];

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.bank.subtract(this.price);
    this.dom.classList.add(this.type);
    this.checkEmployeeStaus();
    this.engine.rentTick$.pipe(takeUntil(this.terminator$$)).subscribe(() => {
      this.bank.add(this.rent);
      this.bank.add((this.jobs - this.jobFree) * this.salary);
      this.cleanOrDity();
    });
    this.engine.add('office', this);
  }

  getEmployee(flat: Flat) {
    this.jobFree -= 1;
    this.flats.push(flat);
    this.checkEmployeeStaus();
    this.cleanOrDity();
  }

  checkEmployeeStaus() {
    this.dom.classList.remove('jobsFree-3');
    this.dom.classList.remove('jobsFree-2');
    this.dom.classList.remove('jobsFree-1');
    this.dom.classList.remove('jobsFree-0');
    this.dom.classList.add('jobsFree-' + this.jobFree);
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
      if (this.vacant >= 5) {
        this.dom.classList.add('dangerous');
        if (this.vacant >= 7) {
          this.engine.destroy(this.type, this);
        }
      }
    } else {
      this.dom.classList.remove('dirty');
      this.dom.classList.remove('dangerous');
    }
  }

  leave(flat: Flat) {
    const index = this.flats.map((f) => f.id).indexOf(this.id);
    this.flats.splice(index, 1);
    this.jobFree = 3 - this.flats.length;
    this.checkEmployeeStaus();
  }

  destroy() {
    this.terminator$$.next(1);
    this.terminator$$.complete();
    this.dom.classList.remove(
      'office',
      'jobsFree-0',
      'jobsFree-1',
      'jobsFree-2',
      'jobsFree-3',
      'dirty',
      'dangerous',
      'crime'
    );
    this.flats.forEach((flat) => {
      flat.jobs--;
      const index = flat.offices.map((o) => o.id).indexOf(this.id);
      flat.offices.splice(index, 1);
    });
    this.flats = [];
  }
}
