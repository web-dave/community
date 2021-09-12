import { INode } from './node.interface';

export interface IFloor {
  id: number;
  stairs: boolean;
  nodes: INode[];
}
