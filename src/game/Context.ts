import { Application } from 'pixi.js';

import { ResizeManager } from './ResizeManager';
import { World } from './World';

export type ContextStore = {
  readonly cols: number;
  readonly rows: number;
  readonly symbols: number;
  readonly clusterSize: number;
};

export type ContextProps = {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly contentWidth: number;
  readonly contentHeight: number;
};

export class Context {
  public world: World;
  public app: Application;
  public props: ContextProps;
  protected resizeManager: ResizeManager;
  private store: ContextStore;

  constructor(store: Partial<ContextStore>, props?: Partial<ContextProps>) {
    this.store = {
      cols: store.cols ?? 10,
      rows: store.rows ?? 10,
      symbols: store.symbols ?? 4,
      clusterSize: store.clusterSize ?? 2,
    };

    this.props = {
      canvasWidth: props?.canvasWidth ?? 1920,
      canvasHeight: props?.canvasHeight ?? 1920,
      contentWidth: props?.contentWidth ?? 1080,
      contentHeight: props?.contentHeight ?? 1080,
    };

    this.app = new Application({
      backgroundColor: 0x555556,
      resolution: Math.min(Math.max(globalThis.devicePixelRatio, 1), 2),
    });

    this.world = new World(this.props);
    this.app.stage.addChild(this.world.root);

    this.resizeManager = new ResizeManager(this.app, this.props);
  }

  public get<TKey extends keyof ContextStore>(key: TKey): ContextStore[TKey] {
    return this.store[key];
  }

  public set<TKey extends keyof ContextStore>(key: TKey, value: ContextStore[TKey]): void {
    this.store[key] = value;
  }

  public has(key: keyof ContextStore): boolean {
    return key in this.store;
  }

  public start(): void {
    this.resizeManager.start();
  }

  public stop(): void {
    this.app.destroy(true);
  }
}
