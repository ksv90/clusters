import { createMachine } from '@xstate/fsm';

import { Context } from './Context';
import { AsyncSeriesFn, isAsyncSeries, isSeries, isTransition } from './machine';
import { Service, ServiceConfig, ServiceListener } from './Service';

export type GameOptions = {
  readonly scene: {
    readonly cols: number;
    readonly rows: number;
    readonly symbols: number;
    readonly clusterSize: number;
  };
};

export type GameEventObject = {
  type: 'NEXT' | 'COMPLETE';
};

export class Game<TEventObject extends GameEventObject> {
  protected context: Context;

  protected service: Service<Context, TEventObject>;

  constructor(options: GameOptions) {
    this.context = new Context(options.scene);

    this.service = new Service(this.serviceListener);
  }

  public get canvas(): HTMLCanvasElement {
    return this.context.app.view;
  }

  public start(machineConfig: ServiceConfig<Context, TEventObject>) {
    machineConfig.context = this.context;
    const machine = createMachine(machineConfig);
    this.service.start(machine);
    this.context.start();
  }

  public stop(): void {
    this.service.stop();
    this.context.stop();
  }

  public next(): void {
    this.service.send('NEXT');
  }

  protected serviceListener: ServiceListener<Context, TEventObject> = (state) => {
    const handler = state.actions.reduce<{ series: Array<AsyncSeriesFn<Context>>; transition?: () => void }>(
      (acc, current) => {
        if (isAsyncSeries(current)) {
          current.actions.forEach((action) => acc.series.push(action));
        } else if (isSeries(current)) {
          current.actions.forEach((action) => {
            const asyncAction = () => {
              return new Promise<void>((resolve, reject) => {
                try {
                  action(this.context, resolve);
                } catch (error) {
                  reject(error);
                }
              });
            };
            acc.series.push(asyncAction);
          });
        } else if (isTransition(current)) {
          if (acc.transition) throw new Error('transition error');
          acc.transition = () => this.service.send(current.event);
        }
        return acc;
      },
      { series: [] },
    );

    const series = handler.series.reduce((acc, current) => acc.then(() => current(this.context)), Promise.resolve());
    series
      .then(() => {
        handler.transition?.();
      })
      .catch((error) => {
        // TODO: обработать ошибку
        console.log(error);
      });
  };
}
