import { INode } from 'models/node.interface';
import { first, takeUntil } from 'rxjs/operators';
import { BankService, prizes } from '../bank.service';
import { GameService } from '../game.service';
import { takeEveryNth } from '../utils/operators';
import { IPerson } from 'models/person.interface';
import { Person } from '../utils/person';
import { Subject } from 'rxjs';
import { Office } from './office';
import { School } from './school';

export class Flat {
  public readonly type = 'flat';
  public price = prizes[this.type];
  private rent = 500;

  public id = new Date().getTime();

  private terminator$$ = new Subject<number>();

  adults = 2;
  kids = 0;
  jobs = 0;
  schools: School[] = [];
  attractions = 0;
  noSchoolCounter = 0;
  offices: Office[] = [];

  constructor(
    public node: INode,
    private dom: HTMLDivElement,
    private engine: GameService,
    private bank: BankService
  ) {
    this.dom.classList.add(this.type);

    this.bank.subtract(this.price);

    this.engine.rentTick$.pipe(takeUntil(this.terminator$$)).subscribe(() => {
      this.bank.add(this.rent);
      if (this.kids != this.schools.length) {
        this.dom.classList.add('no-school');
        this.noSchoolCounter++;
      } else {
        this.dom.classList.remove('no-school');
        this.noSchoolCounter = 0;
      }
      if (this.noSchoolCounter >= 6) {
        this.engine.destroy(this.type, this);
      }
    });

    this.engine.rentTick$.pipe(takeEveryNth(7), first()).subscribe(() => {
      this.kids = Math.floor(Math.random() * 4);
      this.dom.classList.add('kids-' + this.kids);
      if (this.kids === 0) {
        this.dom.classList.add('couple');
      } else {
        this.dom.classList.add('family');
      }
    });

    this.engine.add('flat', this);
  }

  getAJob(office: Office) {
    this.offices.push(office);
    this.jobs = this.adults - this.offices.length;
  }
  getASchool(school: School) {
    this.schools.push(school);
  }

  destroy() {
    this.terminator$$.next(1);
    this.terminator$$.complete();
    this.dom.classList.remove(
      'flat',
      'couple',
      'no-school',
      'family',
      'kids-0',
      'kids-1',
      'kids-2',
      'kids-3',
      'kids-4'
    );
    this.offices.forEach((office) => {
      office.leave(this);
    });
    this.offices = [];
    this.schools.forEach((school) => {
      school.leave(this);
    });
    this.schools = [];
  }
}
