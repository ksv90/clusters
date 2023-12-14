import { EventObject, StateMachine } from '@xstate/fsm';

export type NextAction = () => void;

export const SERIES_TYPE = '@series';

export type SeriesType = typeof SERIES_TYPE;

export type SeriesFn<TContext extends object> = (context: TContext, next: NextAction) => void;

export interface SeriesObject<TContext extends object, TEventObject extends EventObject>
  extends StateMachine.ActionObject<TContext, TEventObject> {
  type: SeriesType;
  actions: ReadonlyArray<SeriesFn<TContext>>;
}

export function series<TContext extends object, TEventObject extends EventObject>(
  ...actions: ReadonlyArray<SeriesFn<TContext>>
): SeriesObject<TContext, TEventObject> {
  return { type: SERIES_TYPE, actions };
}

export function isSeries<TContext extends object, TEventObject extends EventObject>(
  value: StateMachine.ActionObject<TContext, TEventObject>,
): value is SeriesObject<TContext, TEventObject> {
  return value.type === SERIES_TYPE;
}

export const ASYNC_SERIES_TYPE = '@async-series';
export type AsyncSeriesType = typeof ASYNC_SERIES_TYPE;

export type AsyncSeriesFn<TContext extends object> = (context: TContext) => Promise<void>;

export interface AsyncSeriesObject<TContext extends object, TEventObject extends EventObject>
  extends StateMachine.ActionObject<TContext, TEventObject> {
  type: AsyncSeriesType;
  actions: ReadonlyArray<AsyncSeriesFn<TContext>>;
}

export function asyncSeries<TContext extends object, TEventObject extends EventObject>(
  ...actions: ReadonlyArray<AsyncSeriesFn<TContext>>
): AsyncSeriesObject<TContext, TEventObject> {
  return { type: ASYNC_SERIES_TYPE, actions };
}

export function isAsyncSeries<TContext extends object, TEventObject extends EventObject>(
  value: StateMachine.ActionObject<TContext, TEventObject>,
): value is AsyncSeriesObject<TContext, TEventObject> {
  return value.type === ASYNC_SERIES_TYPE;
}

export const TRANSITION_TYPE = '@transition';

export type TransitionType = typeof TRANSITION_TYPE;

export type TransitionFn<TEventObject extends EventObject> = (event: TEventObject['type']) => void;

export interface TransitionObject<TContext extends object, TEventObject extends EventObject>
  extends StateMachine.ActionObject<TContext, TEventObject> {
  type: TransitionType;
  event: TEventObject['type'];
}

export function transition<TContext extends object, TEventObject extends EventObject>(
  event: TEventObject['type'],
): TransitionObject<TContext, TEventObject> {
  return { type: TRANSITION_TYPE, event };
}

export function isTransition<TContext extends object, TEventObject extends EventObject>(
  value: StateMachine.ActionObject<TContext, TEventObject>,
): value is TransitionObject<TContext, TEventObject> {
  return value.type === TRANSITION_TYPE;
}
