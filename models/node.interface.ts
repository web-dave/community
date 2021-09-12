import { Unit } from 'src/app/unit.class';

export interface INode {
  id: number;
  floor: number;
  unit?: Unit;
}
