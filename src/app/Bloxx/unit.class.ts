import { Stairs } from './stairs.class';

export class Unit {
  prize = 3500;
  tenant!: Stairs;
  name: string = '';
  constructor(
    public id: number,
    public floor: number,
    public dom: HTMLDivElement
  ) {
    this.name = 'unit-' + this.floor + '-' + this.id;
    this.dom.style.backgroundImage = 'url("assets/img/icon/unit.png")';
  }
}
