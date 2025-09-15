import { createSelector } from '@ngrx/store';
import { appState, State } from './reducers';

export const stateSelector = (app: appState) => app.state;
export const balanceSelector = createSelector(
  stateSelector,
  (state: State) => state.accountValue
);
