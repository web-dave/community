import { INode } from './node.interface';

export interface IFloor {
  id: number;
  elevator: boolean;
  nodes: INode[];
}
