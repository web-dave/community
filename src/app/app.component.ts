import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'st-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('gameboard') gameboard!: HTMLDivElement;
  total_floors = new Array(16);
  total_floor_nodes = new Array(30);
  cursor_style = 'url("assets/img/icon/pointer.png"), pointer';
  constructor() {}

  updatePointer(icon: string) {
    this.cursor_style = `url('assets/img/icon/${icon}.png'), pointer`;
    console.log(icon, this.cursor_style);
  }
  build(node: string) {}
}
