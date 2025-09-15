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

export type UnitType = 'unit' | 'flat' | 'office' | 'school' | 'shoping';
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
  units: IUnit[];
  accountValue: number;
}

export const initialState: State = {
  offices: [],
  schools: [],
  flats: [],
  units: [],
  accountValue: 35000,
};

export const reducer = createReducer(
  initialState,
  on(rentAction, (state, action) => {
    const newBalnance = state.flats.reduce(
      (balance, flat) => balance - 50,
      state.accountValue
    );
    return { ...state, accountValue: newBalnance };
  }),
  on(buildUnitAction, (state, action) => {
    if (!prizes[action.unitType]) {
      return state;
    }
    if (state.accountValue - prizes[action.unitType] < 0) {
      return state;
    }
    let list: string[] = [];
    const newBalnance = state.accountValue - prizes[action.unitType];
    const newState: State = { ...state, accountValue: newBalnance };
    switch (action.unitType) {
      case 'unit':
        const newUnit: IUnit = {
          id: action.id,
          reachable: false,
          condition: 'clean',
          type: action.unitType,
        };
        newState.units = [...state.units, newUnit];
        break;
      case 'flat':
        newState.units = state.units.map((u) => {
          if (u.id == action.id) {
            return {
              ...u,
              adults: 2,
              kids: 2,
              offices: [],
              schools: [],
            };
          }
          return u;
        });
        newState.flats = [...state.flats, action.id];
        break;
      case 'office':
        newState.units = state.units.map((u) => {
          if (u.id == action.id) {
            return {
              ...u,
              employees: [],
              jobs: 5,
            };
          }
          return u;
        });
        newState.offices = [...state.offices, action.id];
        break;
      case 'school':
        newState.units = state.units.map((u) => {
          if (u.id == action.id) {
            return {
              ...u,
              pupils: [],
              seats: 12,
            };
          }
          return u;
        });

        newState.schools = [...state.schools, action.id];
        break;
    }

    return newState;
  })
);

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
