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
import { balanceAction } from './actions';

export type UnitType = 'Flat' | 'Office' | 'School';

export interface State {
  offices: string[];
  schools: string[];
  flats: string[];
  units: {
    id: string;
    reachable: boolean;
    condition: 'clean' | 'dirty';
    adults?: number;
    kids?: number;
    type: UnitType;
    offices?: string[];
    schools?: string[];
    jobs?: number;
    employees?: string[];
    seats?: 12;
  }[];
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
  on(balanceAction, (state, action) => {
    const newBalnance = state.flats.reduce(
      (balance, flat) => balance - 500,
      state.accountValue
    );
    return { ...state, accountValue: newBalnance };
  })
);

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
