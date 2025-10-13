import { createAction, props } from '@ngrx/store';
import { UnitType } from './reducers';

export const buildUnitAction = createAction(
  'BUILD UNIT',
  props<{
    unitType: UnitType;
    id: string;
    kids: number;
  }>()
);
export const timeAction = createAction('One Month');
