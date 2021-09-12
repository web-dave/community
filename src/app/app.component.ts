import { Component, ViewChild } from '@angular/core';
import { IBloxx } from 'models/bloxx.interface';
import { GameService } from './game.service';

@Component({
  selector: 'st-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  total_floors = this.engine.total_floors;
  cursor_style = 'url("assets/img/icon/pointer.png"), pointer';
  constructor(private engine: GameService) {}

  updatePointer(icon: IBloxx) {
    this.engine.activeBlock = icon;
    this.cursor_style = `url('assets/img/icon/${icon}.png'), pointer`;
  }
}
