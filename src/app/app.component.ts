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
  total_floors = this.engine.total_floors;
  constructor(public engine: GameService, public bank: BankService) {}

  updatePointer(icon: IBloxx) {
    this.engine.activeBlock = icon;
  }
}
