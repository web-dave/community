import { Unit } from 'src/app/Bloxx/unit';

export interface INode {
  id: number;
  floor: number;
  unit?: Unit;
}
