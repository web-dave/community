import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { Flat } from './Bloxx/flat';
import { Office } from './Bloxx/office';
import { takeEveryNth } from './utils/operators';
import { Shopping } from './Bloxx/shopping';
import { School } from './Bloxx/school';
import { Safety } from './Bloxx/safety';
import { Attractions } from './Bloxx/attractions';
import { Unit } from './Bloxx/unit';
import { Elevator } from './Bloxx/elevator';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  offices: Office[] = [];
  flats: Flat[] = [];
  shopping: Shopping[] = [];
  schools: School[] = [];
  safety: Safety[] = [];
  attractions: Attractions[] = [];
  units: Unit[] = [];
  elevator: Elevator[] = [];

  constructor() {}

  manage() {
    this.findJob();
    this.findSchool();
    this.findSafety();
  }

  findJob() {
    this.flats
      .filter(
        (flat) =>
          flat.offices.length + flat.shoppings.length < flat.adults
      )
      .forEach((flat) => {
        const freeOffices = this.offices.filter((office) => office.jobFree >= 1);
        const freeShopping = this.shopping.filter((shop) => shop.jobFree >= 1);
        const allFreeJobs: (Office | Shopping)[] = [
          ...freeOffices,
          ...freeShopping,
        ];
        if (allFreeJobs.length >= 1) {
          const freeJob =
            allFreeJobs[Math.floor(Math.random() * allFreeJobs.length)];
          if (freeJob.type === 'office') {
            (freeJob as Office).getEmployee(flat);
            flat.getAJob(freeJob as Office);
          } else {
            (freeJob as Shopping).getEmployee(flat);
            flat.getAShoppingJob(freeJob as Shopping);
          }
        }
      });
  }
  findSchool() {
    this.flats
      .filter((flat) => flat.kids !== 0)
      .filter((flat) => flat.kids > flat.schools.length)
      .forEach((flat) => {
        const freeSchools = this.schools.filter(
          (school) => school.maxNumberOfKids > school.kids.length
        );
        if (freeSchools.length >= 1) {
          const freeSchool =
            freeSchools[Math.floor(Math.random() * freeSchools.length)];
          freeSchool.getKid(flat);
          flat.getASchool(freeSchool);
        }
      });
  }

  findSafety() {
    this.flats
      .filter((flat) => flat.safeties.length === 0)
      .forEach((flat) => {
        const people = flat.adults + flat.kids;
        const availableSafety = this.safety.find(
          (s) => s.peopleCount + people <= s.maxCapacity
        );
        if (availableSafety) {
          availableSafety.protect(flat);
        }
      });
  }

  addOffice(t: Office) {
    this.offices.push(t);
    this.manage();
  }

  destroyOffice(t: Office) {
    let index = this.offices.map((o) => o.id).indexOf(t.id);
    this.offices.splice(index, 1);
    t.destroy();
    if (t.node.unit?.tenant) {
      t.node.unit.tenant = undefined;
    }
    this.manage();
  }

  addFlat(t: Flat) {
    this.flats.push(t);
    this.manage();
  }

  destroyFlat(t: Flat) {
    let index = this.flats.map((f) => f.id).indexOf(t.id);
    this.flats.splice(index, 1);
    t.destroy();

    if (t.node.unit?.tenant) {
      t.node.unit.tenant = undefined;
    }
    this.manage();
  }

  addShopping(t: Shopping) {
    this.shopping.push(t);
    this.manage();
  }

  addSchool(t: School) {
    this.schools.push(t);
    this.manage();
  }

  addSafety(t: Safety) {
    this.safety.push(t);
    this.manage();
  }

  addAttractions(t: Attractions) {
    this.attractions.push(t);
    this.manage();
  }

  destroyAttractions(t: Attractions) {
    const index = this.attractions.map((a) => a.id).indexOf(t.id);
    this.attractions.splice(index, 1);
    t.destroy();
    if (t.node.unit?.tenant) {
      t.node.unit.tenant = undefined;
    }
    this.manage();
  }

  addUnit(t: Unit) {
    this.units.push(t);
    this.manage();
  }

  addElevator(t: Elevator) {
    this.elevator.push(t);
    this.manage();
  }
}
