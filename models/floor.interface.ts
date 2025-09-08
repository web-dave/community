import { INode } from './node.interface';

export interface IFloor {
  floor: number;
  elevator: boolean;
  nodes: INode[];
}
