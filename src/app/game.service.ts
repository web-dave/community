import { Injectable } from '@angular/core';
import { IBloxx } from 'models/bloxx.interface';
import { IFloor } from 'models/floor.interface';
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
import { Stairs } from './Bloxx/stairs';

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
  dialogData$ = new Subject<string[]>();

  tick$ = interval(2000).pipe(share());
  rentTick$ = this.tick$.pipe(
    takeEveryNth(7),
    tap((i) => console.log(i, this.manage))
  );

  constructor(public manage: ManagementService) {
    this.total_floors = [...Array(this.floors_count).keys()].map((i) => ({
      id: i,
      stairs: false,
      nodes: [...Array(this.unit_count).keys()].map((j) => ({
        id: j,
        floor: i,
      })),
    }));
    this.rentTick$.subscribe(() => {
      this.manage.findJob();
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
    this.total_floors[floor].stairs = true;
  }

  isConnected(floor: number): boolean {
    if (floor === 10) {
      return true;
    }
    if (
      floor <= 9 &&
      this.total_floors[floor].stairs &&
      this.total_floors[floor + 1].stairs
    ) {
      return true;
    }
    if (
      floor >= 11 &&
      this.total_floors[floor].stairs &&
      this.total_floors[floor - 1].stairs
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
      | Stairs
  ) {
    switch (block) {
      case 'unit':
        this.manage.addUnit(instance as Unit);
        this.persistData(block, this.manage.units);
        break;
      case 'attractions':
        this.manage.addAttractions(instance as Attractions);
        this.persistData(block, this.manage.attractions);
        break;
      case 'flat':
        this.manage.addFlat(instance as Flat);
        this.persistData(block, this.manage.flats);
        break;
      case 'office':
        this.manage.addOffice(instance as Office);
        this.persistData(block, this.manage.offices);
        break;
      case 'safety':
        this.manage.addSafety(instance as Safety);
        this.persistData(block, this.manage.safety);
        break;
      case 'school':
        this.manage.addSchool(instance as School);
        this.persistData(block, this.manage.school);
        break;
      case 'shopping':
        this.manage.addShopping(instance as Shopping);
        this.persistData(block, this.manage.shopping);
        break;
      case 'stairs':
        this.manage.addStairs(instance as Stairs);
        this.persistData(block, this.manage.stairs);
        break;
    }
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
      | Stairs
  ) {
    switch (block) {
      case 'flat':
        this.manage.destroyFlat(instance as Flat);
        this.persistData(block, this.manage.flats);
        break;
      case 'office':
        this.manage.destroyOffice(instance as Office);
        this.persistData(block, this.manage.offices);
        break;
      case 'safety':
        break;
      case 'school':
        break;
      case 'shopping':
        break;
      case 'stairs':
        break;
    }
  }

  persistData(
    key: IBloxx,
    data:
      | Office[]
      | Flat[]
      | Shopping[]
      | School[]
      | Safety[]
      | Attractions[]
      | Unit[]
      | Stairs[]
  ) {
    // localStorage.setItem(key, JSON.stringify(data));
  }

  showDialog(data: string[]) {
    const value = data.map((v) => v.replace('-', ': '));
    this.dialogData$.next(value);
  }
}
