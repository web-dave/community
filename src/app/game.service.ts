import { Injectable } from '@angular/core';
import { IBloxx } from 'models/bloxx.interface';
import { IFloor } from 'models/floor.interface';
import { INode } from 'models/node.interface';
import { interval, Subject } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { ManagementService } from './management.service';
import { takeEveryNth } from './utils/operators';
import { Unit } from './Bloxx/unit';
import { Attractions } from './Bloxx/attractions';
import { Flat } from './Bloxx/flat';
import { Office } from './Bloxx/office';
import { Safety } from './Bloxx/safety';
import { School } from './Bloxx/school';
import { Shopping } from './Bloxx/shopping';
import { Elevator } from './Bloxx/elevator';
import { BankService } from './bank.service';
import { ISaveData, SaveService } from './save.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  floor_offset = 0;
  node_offset = 0;
  floors_count = 16;
  unit_count = 25;
  activeBlock: IBloxx = 'unit';
  total_floors: IFloor[] = [];
  units: {
    [key: string]: {
      id: number;
      floor: number;
      dom?: HTMLDivElement;
      tenant?:
        | Elevator
        | Office
        | Attractions
        | Flat
        | Safety
        | School
        | Shopping;
    };
  } = {};
  dialogData$ = new Subject<string[]>();

  tick$ = interval(2000).pipe(share());
  rentTick$ = this.tick$.pipe(
    takeEveryNth(7)
    // tap((i) => console.log(i, this.manage))
  );
  fireTick$ = this.tick$.pipe(takeEveryNth(12));

  constructor(
    public manage: ManagementService,
    private bank: BankService,
    private saveService: SaveService
  ) {
    this.total_floors = [...Array(this.floors_count).keys()].map((i) => ({
      floor: i,
      elevator: false,
      nodes: [...Array(this.unit_count).keys()].map((j) => {
        this.units[i + '_' + j] = { id: j, floor: i };
        return this.units[i + '_' + j];
      }),
    }));
    console.log(this.total_floors);
    console.log(this.units);
    this.rentTick$.subscribe(() => {
      this.manage.manage();
    });
    this.fireTick$.subscribe(() => {
      const unprotected = this.manage.flats.filter(
        (flat) => flat.safeties.length === 0
      );
      if (unprotected.length > 0) {
        const target =
          unprotected[Math.floor(Math.random() * unprotected.length)];
        target.catchFire();
        setTimeout(() => this.destroy('flat', target), 2000);
      }
    });
  }

  isAbleToStart(floor: number, node: number): boolean {
    // if (floor === 10) {
    //   console.log(
    //     'floor === 10',
    //     floor,
    //     node,
    //     !this.total_floors[floor].nodes[node].unit
    //   );
    // }
    // if (floor < 10) {
    //   console.log(
    //     'floor < 10',
    //     floor,
    //     node,
    //     !this.total_floors[floor].nodes[node].unit,
    //     !!this.total_floors[floor + 1].nodes[node].unit
    //   );
    // }
    // if (floor > 10) {
    //   console.log(
    //     'floor > 10',
    //     floor,
    //     node,
    //     !this.total_floors[floor].nodes[node].unit,
    //     !!this.total_floors[floor - 1].nodes[node].unit
    //   );
    // }

    if (floor === 10 && !this.total_floors[floor].nodes[node].unit) {
      return true;
    }
    if (
      floor < 10 &&
      !this.total_floors[floor].nodes[node].unit &&
      !!this.total_floors[floor + 1].nodes[node].unit
    ) {
      return true;
    }
    if (
      floor > 10 &&
      !this.total_floors[floor].nodes[node].unit &&
      !!this.total_floors[floor - 1].nodes[node].unit
    ) {
      return true;
    }
    return false;
  }

  connectFloor(floor: number) {
    this.total_floors[floor].elevator = true;
  }

  isConnected(floor: number): boolean {
    if (floor === 10) {
      return true;
    }
    if (
      floor <= 9 &&
      this.total_floors[floor].elevator &&
      this.total_floors[floor + 1].elevator
    ) {
      return true;
    }
    if (
      floor >= 11 &&
      this.total_floors[floor].elevator &&
      this.total_floors[floor - 1].elevator
    ) {
      return true;
    }
    return false;
  }

  add(
    block: IBloxx,
    instance:
      | Office
      | Flat
      | Shopping
      | School
      | Safety
      | Attractions
      | Unit
      | Elevator
  ) {
    switch (block) {
      case 'unit':
        this.manage.addUnit(instance as Unit);
        break;
      case 'attractions':
        this.manage.addAttractions(instance as Attractions);
        break;
      case 'flat':
        this.manage.addFlat(instance as Flat);
        break;
      case 'office':
        this.manage.addOffice(instance as Office);
        break;
      case 'safety':
        this.manage.addSafety(instance as Safety);
        break;
      case 'school':
        this.manage.addSchool(instance as School);
        break;
      case 'shopping':
        this.manage.addShopping(instance as Shopping);
        break;
      case 'elevator':
        this.manage.addElevator(instance as Elevator);
        break;
    }
    this.persistData();
  }

  destroy(
    block: IBloxx,
    instance:
      | Office
      | Flat
      | Shopping
      | School
      | Safety
      | Attractions
      | Unit
      | Elevator
  ) {
    let changed = false;
    switch (block) {
      case 'flat':
        this.manage.destroyFlat(instance as Flat);
        changed = true;
        break;
      case 'office':
        this.manage.destroyOffice(instance as Office);
        changed = true;
        break;
      case 'safety':
        break;
      case 'school':
        break;
      case 'shopping':
        break;
      case 'elevator':
        break;
    }
    if (changed) {
      this.persistData();
    }
  }

  persistData() {
    // Defer serialization to the next macrotask so that all DOM references
    // (e.g. stNode.unit and unit.tenant) are fully assigned before we read them.
    setTimeout(() => {
      const placements: ISaveData['placements'] = [];
      this.total_floors.forEach((floor) => {
        floor.nodes.forEach((node) => {
          if (node.unit) {
            placements.push({
              floor: node.floor,
              node: node.id,
              tenant: node.unit.tenant?.type ?? null,
            });
          }
        });
      });
      this.saveService.save({ balance: this.bank.getBalance(), placements });
    }, 0);
  }

  restoreGame(saveData: ISaveData) {
    // Temporarily set balance to max so affordability checks don't block restore.
    // The saved balance is restored after all objects are created.
    this.bank.setBalance(Number.MAX_SAFE_INTEGER);
    saveData.placements.forEach((placement) => {
      const nodeData = this.total_floors[placement.floor]?.nodes[placement.node];
      const domEl = document.getElementById(
        'node_' + placement.floor + '_' + placement.node
      ) as HTMLDivElement;
      if (!nodeData || !domEl) return;
      nodeData.unit = new Unit(nodeData, domEl, this.bank, this);
      if (placement.tenant) {
        nodeData.unit.tenant = this.createTenant(
          placement.tenant,
          nodeData,
          domEl
        );
      }
    });
    this.bank.setBalance(saveData.balance);
  }

  private createTenant(
    type: string,
    nodeData: INode,
    domEl: HTMLDivElement
  ):
    | Elevator
    | Flat
    | Office
    | Shopping
    | School
    | Safety
    | Attractions
    | undefined {
    switch (type) {
      case 'elevator':
        return new Elevator(nodeData, domEl, this, this.bank);
      case 'flat':
        return new Flat(nodeData, domEl, this, this.bank);
      case 'office':
        return new Office(nodeData, domEl, this, this.bank);
      case 'shopping':
        return new Shopping(nodeData, domEl, this, this.bank);
      case 'school':
        return new School(nodeData, domEl, this, this.bank);
      case 'safety':
        return new Safety(nodeData, domEl, this, this.bank);
      case 'attractions':
        return new Attractions(nodeData, domEl, this, this.bank);
      default:
        return undefined;
    }
  }

  showDialog(data: string[]) {
    const value = data.map((v) => v.replace('-', ': '));
    this.dialogData$.next(value);
  }
}