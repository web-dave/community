import { createAction, props } from '@ngrx/store';
import { UnitType } from './reducers';

export const buildUnitAction = createAction(
  'BUILD UNIT',
  props<{
    unitType: UnitType;
    id: string;
  }>()
);
export const rentAction = createAction('pay Rent');
