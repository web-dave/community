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
import { Stairs } from './Bloxx/stairs';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  offices: Office[] = [];
  flats: Flat[] = [];
  shopping: Shopping[] = [];
  school: School[] = [];
  safety: Safety[] = [];
  attractions: Attractions[] = [];
  units: Unit[] = [];
  stairs: Stairs[] = [];

  constructor() {}

  findJob() {
    this.flats
      .filter((flat) => flat.adults > flat.jobs)
      .forEach((flat) => {
        // const freeJob = this.offices.find((office) => office.jobFree >= 1);
        const freeJobs = this.offices.filter((office) => office.jobFree >= 1);
        if (freeJobs.length >= 1) {
          const freeJob = freeJobs[Math.floor(Math.random() * freeJobs.length)];
          freeJob.getEmployee(flat);
          flat.getAJob(freeJob);
        }
      });
  }

  addOffice(t: Office) {
    this.offices.push(t);
    this.findJob();
  }

  destroyOffice(t: Office) {
    let index = this.offices.map((o) => o.id).indexOf(t.id);
    this.offices.splice(index, 1);
    t.destroy();
    if (t.node.unit?.tenant) {
      t.node.unit.tenant = undefined;
    }
    this.findJob();
  }

  addFlat(t: Flat) {
    this.flats.push(t);
    this.findJob();
  }

  destroyFlat(t: Flat) {
    let index = this.flats.map((f) => f.id).indexOf(t.id);
    this.flats.splice(index, 1);
    t.destroy();

    if (t.node.unit?.tenant) {
      t.node.unit.tenant = undefined;
    }
    this.findJob();
  }

  addShopping(t: Shopping) {
    this.shopping.push(t);
    this.findJob();
  }

  addSchool(t: School) {
    this.school.push(t);
    this.findJob();
  }

  addSafety(t: Safety) {
    this.safety.push(t);
    this.findJob();
  }

  addAttractions(t: Attractions) {
    this.attractions.push(t);
    this.findJob();
  }

  addUnit(t: Unit) {
    this.units.push(t);
    this.findJob();
    console.log(this);
  }

  addStairs(t: Stairs) {
    this.stairs.push(t);
    this.findJob();
  }
}
