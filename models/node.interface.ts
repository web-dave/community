import { Unit } from 'src/app/Bloxx/unit.class';

export interface INode {
  id: number;
  floor: number;
  unit?: Unit;
}
