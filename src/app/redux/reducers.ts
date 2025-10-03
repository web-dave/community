import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on,
} from '@ngrx/store';
import { buildUnitAction, rentAction } from './actions';

export type UnitType =
  | 'unit'
  | 'flat'
  | 'office'
  | 'school'
  | 'shopping'
  | 'elevator';
export type condition = 'clean' | 'dirty';

export const prizes: { [key: string]: number } = {
  unit: 500,
  elevator: 300,
  flat: 3000,
  office: 5000,
  shopping: 15000,
  school: 7500,
  safety: 7500,
  attractions: 500,
};

export interface appState {
  state: State;
}

export interface IUnit {
  id: string;
  reachable: boolean;
  condition: condition;
  adults?: number;
  kids?: number;
  type: UnitType;
  offices?: string[];
  schools?: string[];
  jobs?: number;
  employees?: string[];
  pupils?: string[];
  seats?: number;
}

export interface State {
  offices: string[];
  schools: string[];
  flats: string[];
  shoppings: string[];
  elevators: string[];
  units: IUnit[];
  accountValue: number;
}

export const initialState: State = {
  offices: [],
  schools: [],
  shoppings: [],
  elevators: [],
  flats: [],
  units: [],
  accountValue: 35000,
};

const groundFloor = 10;

export const reducer = createReducer(
  initialState,
  on(rentAction, (state, action) => {
    const newBalance = state.flats.reduce(
      (balance, flat) => balance - 50,
      state.accountValue
    );
    return { ...state, accountValue: newBalance };
  }),
  on(buildUnitAction, (state, action) => {
    if (!prizes[action.unitType]) {
      return state;
    }
    if (state.accountValue - prizes[action.unitType] < 0) {
      return state;
    }
    let list: string[] = [];
    const newBalance = state.accountValue - prizes[action.unitType];
    const newState: State = { ...state, accountValue: newBalance };
    const target = state.units.find((u) => u.id == action.id);

    const ids = action.id.split('_');
    const floor = parseInt(ids[0], 10);
    const id = parseInt(ids[1], 10);
    console.log(ids);

    switch (action.unitType) {
      case 'unit':
        if (!!target) {
          return state;
        }
        console.log(floor, groundFloor);
        let reachable = floor == groundFloor;
        if (floor != groundFloor) {
          if (state.elevators.find((u) => u.startsWith(`${floor}_`))) {
            reachable = true;
          }
        }
        const newUnit: IUnit = {
          id: action.id,
          reachable,
          condition: 'clean',
          type: action.unitType,
        };
        console.log(newUnit);
        newState.units = [...state.units, newUnit];
        break;
      case 'flat':
        if (!!target && target.type == 'unit') {
          newState.units = state.units.map((u) => {
            if (u.id == action.id) {
              return {
                ...u,
                adults: 2,
                kids: action.kids,
                type: action.unitType,
                offices: [],
                schools: [],
              };
            }
            return u;
          });
          newState.flats = [...state.flats, action.id];
        } else return state;

        break;
      case 'office':
        if (!!target && target.type == 'unit') {
          newState.units = state.units.map((u) => {
            if (u.id == action.id) {
              return {
                ...u,
                type: action.unitType,
                employees: [],
                jobs: 5,
              };
            }
            return u;
          });
          newState.offices = [...state.offices, action.id];
        } else return state;
        break;
      case 'school':
        if (!!target && target.type == 'unit') {
          newState.units = state.units.map((u) => {
            if (u.id == action.id) {
              return {
                ...u,
                type: action.unitType,
                pupils: [],
                seats: 12,
              };
            }
            return u;
          });

          newState.schools = [...state.schools, action.id];
        } else return state;
        break;
      case 'shopping':
        if (!!target && target.type == 'unit') {
          newState.units = state.units.map((u) => {
            if (u.id == action.id) {
              return {
                ...u,
                type: action.unitType,
              };
            }
            return u;
          });

          newState.shoppings = [...state.shoppings, action.id];
        } else return state;
        break;
      case 'elevator':
        let isConnectable = false;
        if (floor == groundFloor) {
          isConnectable = true;
        }
        if (floor <= groundFloor - 1) {
          if (state.elevators.includes(`${floor + 1}_${id}`)) {
            isConnectable = true;
          }
        }
        if (floor >= groundFloor + 1) {
          if (state.elevators.includes(`${floor - 1}_${id}`)) {
            isConnectable = true;
          }
        }
        if (!!target && target.type == 'unit' && isConnectable) {
          newState.units = state.units
            .map((u) => {
              if (u.id == action.id) {
                return {
                  ...u,
                  type: action.unitType,
                  reachable: true,
                };
              }
              return u;
            })
            .map((u) => {
              if (u.id.startsWith(`${floor}_`)) {
                return { ...u, reachable: true };
              }
              return u;
            });

          newState.elevators = [...state.elevators, action.id];
        } else return state;
        break;
    }

    return newState;
  })
);

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
