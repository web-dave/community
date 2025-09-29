import { createSelector } from '@ngrx/store';
import { appState, State } from './reducers';

export const stateSelector = (app: appState) => app.state;
export const balanceSelector = createSelector(
  stateSelector,
  (state: State) => state.accountValue
);

export const typeClassSelector = (id: string) =>
  createSelector(stateSelector, (state: State) => {
    const unit = state.units.find((u) => u.id == id);
    if (!!unit) {
      const classlist: string[] = ['unit', unit.type];
      if (!unit.reachable) {
        classlist.push('no-connection');
      }

      if (unit.type == 'flat') {
        classlist.push(unit.kids == 0 ? 'couple' : 'family');
      }
      if (unit.type == 'school') {
        unit.pupils?.length;
        const freeSeats = (unit.seats ?? 0) - (unit.pupils?.length ?? 0);
        classlist.push('seatsFree-' + freeSeats);
      }

      return classlist.join(' ');
    }
    return '';
  });
