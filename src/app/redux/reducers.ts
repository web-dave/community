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
import { buildUnitAction, timeAction } from './actions';

export type UnitType =
  | 'unit'
  | 'flat'
  | 'office'
  | 'school'
  | 'shopping'
  | 'elevator'
  | 'safety';
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

export enum MOOD {
  notHappy = 'notHappy',
  happy = 'happy',
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
  mood: MOOD;
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
const unitCount = 25;
const floorCount = 16;

function getIdListOfAccessibleUnits(
  state: State,
  floor: number,
  node: number,
): string[] {
  const units = state.units
    .filter((u) => u.id.startsWith(`${floor}_`))
    .map((u) => u.id);
  const accessibleIds = [];
  for (let i = node - 1; i >= 0; --i) {
    if (units.includes(`${floor}_${i}`)) {
      accessibleIds.push(`${floor}_${i}`);
    } else break;
  }
  for (let i = node + 1; i < unitCount; ++i) {
    if (units.includes(`${floor}_${i}`)) {
      accessibleIds.push(`${floor}_${i}`);
    } else break;
  }
  return accessibleIds;
}

function searchChangeReachableUnits(
  accessibleIds: string[],
  floor: number,
  id: number,
  state: State,
  direction: number,
): string[] {
  const changeReachableUnits: string[] = [];
  if (accessibleIds.includes(`${floor}_${id + direction}`)) {
    const lu = state.units.find((u) => u.id === `${floor}_${id + direction}`);
    if (lu && !lu.reachable) {
      for (let i = id + direction; i >= 0 && i < unitCount; i += direction) {
        if (accessibleIds.includes(`${floor}_${i}`)) {
          changeReachableUnits.push(`${floor}_${i}`);
        } else break;
      }
    }
  }
  return changeReachableUnits;
}

export const reducer = createReducer(
  initialState,
  on(timeAction, (state, action) => {
    const newBalance = state.flats.reduce(
      (balance, flat) => balance - 50,
      state.accountValue,
    );
    let offices = state.units.filter((u) => u.type == 'office');
    const officeAddJobs: { [id: string]: number } = {};
    const schoolAddPupils: { [id: string]: number } = {};
    const flatUnits = state.units.map((u) => {
      if (u.type == 'flat') {
        const flat = { ...u };

        // find Job
        const jobAdults = flat.adults ?? 0;
        const jobs = flat.offices?.length ?? 0;
        const jobStop = jobAdults - jobs;
        for (let i = 0; i < jobStop; i++) {
          const office = state.units
            .filter((u) => u.type == 'office')
            .find((o) => (o.jobs as number) > (o.employees?.length as number) + (officeAddJobs[o.id] ?? 0));
          if (!!office) {
            flat.offices = [...(flat.offices as string[]), office.id as string];
            officeAddJobs[office.id] = (officeAddJobs[office.id] ?? 0) + 1;
          }
        }

        // find school
        const schoolKids = flat.kids ?? 0;
        const flatSchool = flat.schools?.length ?? 0;
        const schoolStop = schoolKids - flatSchool;
        for (let i = 0; i < schoolStop; i++) {
          const school = state.units
            .filter((u) => u.type == 'school')
            .find((o) => (o.seats as number) > (o.pupils?.length as number) + (schoolAddPupils[o.id] ?? 0));
          if (!!school) {
            flat.schools = [...(flat.schools as string[]), school.id as string];
            schoolAddPupils[school.id] = (schoolAddPupils[school.id] ?? 0) + 1;
          }
        }

        const kids = flat.kids ?? 0;
        const school = flat.schools?.length ?? 0;
        console.log(flat);
        if (kids > school) {
          flat.mood = MOOD.notHappy;
        } else {
          flat.mood = MOOD.happy;
        }
        return flat;
      } else {
        return u;
      }
    });
    const units = flatUnits.map((unit) => {
      if (unit.type == 'office' && officeAddJobs[unit.id]) {
        const employees = flatUnits
          .filter((u) => u.type == 'flat')
          .filter((u) => u.offices?.includes(unit.id))
          .map((u) =>
            (u.offices as string[]).filter((o) => o == unit.id).map(() => u.id),
          )
          .flat();
        console.log('Flats ID:', employees);
        const office = { ...unit, employees };
        return office;
      } else if (unit.type == 'school' && schoolAddPupils[unit.id]) {
        const pupils = flatUnits
          .filter((u) => u.type == 'flat')
          .filter((u) => u.schools?.includes(unit.id))
          .map((u) =>
            (u.schools as string[]).filter((o) => o == unit.id).map(() => u.id),
          )
          .flat();
        const school = { ...unit, pupils };
        return school;
      } else return unit;
    });

    return { ...state, units, accountValue: newBalance };
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
    const checkFloor = floor > groundFloor ? -1 : floor < groundFloor ? 1 : 0;
    console.log(ids);

    switch (action.unitType) {
      case 'unit':
        if (!!target) {
          return state;
        }
        console.log(floor, groundFloor);
        let reachable = floor == groundFloor;
        let changeReachableUnits: string[] = [];
        if (floor != groundFloor) {
          if (!state.units.find((u) => u.id === `${floor + checkFloor}_${id}`))
            return state;
          if (state.elevators.find((u) => u.startsWith(`${floor}_`))) {
            const accessibleIds = getIdListOfAccessibleUnits(state, floor, id);
            const elevatorIds = state.elevators.filter((u) =>
              u.startsWith(`${floor}_`),
            );
            const elevatorReachable = elevatorIds.some((u) =>
              accessibleIds.includes(u),
            );
            if (elevatorReachable) {
              reachable = true;
              changeReachableUnits = searchChangeReachableUnits(
                accessibleIds,
                floor,
                id,
                state,
                -1,
              );
              changeReachableUnits = [
                ...changeReachableUnits,
                ...searchChangeReachableUnits(
                  accessibleIds,
                  floor,
                  id,
                  state,
                  1,
                ),
              ];
            }
          }
        }
        const newUnit: IUnit = {
          id: action.id,
          reachable,
          condition: 'clean',
          type: action.unitType,
          mood: MOOD.happy,
        };
        console.log(newUnit);
        newState.units = [...state.units, newUnit];
        if (changeReachableUnits.length > 0) {
          newState.units = newState.units.map((u) => {
            if (changeReachableUnits.includes(u.id)) {
              return { ...u, reachable: true };
            }
            return u;
          });
        }
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
        if (
          checkFloor === 0 ||
          state.elevators.includes(`${floor + checkFloor}_${id}`)
        ) {
          isConnectable = true;
        } else {
          const accessibleIds = getIdListOfAccessibleUnits(state, floor, id);
          const elevatorIds = state.elevators.filter((u) =>
            u.startsWith(`${floor}_`),
          );
          isConnectable = elevatorIds.some((u) => accessibleIds.includes(u));
        }
        if (!!target && target.type == 'unit' && isConnectable) {
          const accessibleIds = getIdListOfAccessibleUnits(state, floor, id);
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
              if (
                u.id.startsWith(`${floor}_`) &&
                accessibleIds.includes(u.id)
              ) {
                return { ...u, reachable: true };
              }
              return u;
            });

          newState.elevators = [...state.elevators, action.id];
        } else return state;
        break;
      case 'safety':
        break;
    }

    return newState;
  }),
);

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
