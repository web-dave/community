export class Unit {
  prize = 3500;
  tenant: { [key: string]: string | number } = {};
  constructor(public id: number, public name: string, public floor: number) {}
}
