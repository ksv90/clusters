import { StateMachine } from '@xstate/fsm';

import { asyncSeries, Context, GameEventObject, series, ServiceConfig, transition } from '../game';
import { clear, createGrid, loadData, win } from './actions';

export type GameState = 'init' | 'load' | 'win';

export type GameTypeState<TContext extends object> = {
  value: GameState;
  context: TContext;
};

export const createMachineConfig = <TContext extends Context>(): ServiceConfig<TContext, GameEventObject> => {
  return {
    initial: 'init',
    states: {
      init: {
        entry: [series(createGrid), transition('COMPLETE')],
        on: {
          COMPLETE: 'load',
        },
      },
      load: {
        entry: [asyncSeries(loadData), transition('COMPLETE')],
        on: {
          COMPLETE: 'win',
        },
      },
      win: {
        entry: [series(win)],
        exit: [series(clear)],
        on: {
          NEXT: 'load',
        },
      },
    },
  } satisfies StateMachine.Config<TContext, GameEventObject, GameTypeState<TContext>>;
};
