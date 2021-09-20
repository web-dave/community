import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { Flat } from './Bloxx/flat';
import { Office } from './Bloxx/office';
import { takeEveryNth } from './utils/operators';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  offices: Office[] = [];
  tenants: Flat[] = [];

  constructor() {}

  findJob() {
    this.tenants
      .filter((flat) => flat.adults > flat.jobs)
      .forEach((flat) => {
        const freeJob = this.offices.find((office) => office.jobFree >= 1);
        if (freeJob) {
          freeJob.jobFree -= 1;
          flat.jobs += 1;
        }
      });
  }

  addOffice(t: Office) {
    this.offices.push(t);
    this.findJob();
  }

  addTenant(t: Flat) {
    this.tenants.push(t);
    this.findJob();
  }
}
