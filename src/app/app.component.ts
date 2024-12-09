import { Component } from '@angular/core';
import { IBloxx } from 'models/bloxx.interface';
import { BankService } from './bank.service';
import { GameService } from './game.service';

@Component({
  selector: 'st-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dayLight = 0;
  timeTable = [1, 2, 3, 4, 3, 2, 1];
  total_floors = this.engine.total_floors;
  constructor(public engine: GameService, public bank: BankService) {
    this.engine.tick$.subscribe(() => {
      if (this.dayLight === 6) {
        this.dayLight = -1;
      }
      this.dayLight++;
    });
  }

  updatePointer(icon: IBloxx) {
    this.engine.activeBlock = icon;
  }
}
