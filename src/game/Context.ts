import { Application, Loader, utils } from 'pixi.js';
import { SpineParser } from 'pixi-spine';
import { ServerWin } from 'src/server/types';

import { ResizeManager } from './ResizeManager';
import { World } from './World';

export type ContextStore = {
  readonly cols: number;
  readonly rows: number;
  readonly symbols: number;
  readonly clusterSize: number;
  readonly win: ServerWin | null;
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

  constructor(store: Partial<ContextStore>, props?: ContextProps) {
    this.store = {
      cols: store.cols ?? 5,
      rows: store.rows ?? 3,
      symbols: store.symbols ?? 2,
      clusterSize: store.clusterSize ?? 3,
      win: null,
    };

    this.props = {
      canvasWidth: props?.canvasWidth ?? 1920,
      canvasHeight: props?.canvasHeight ?? 1920,
      contentWidth: props?.contentWidth ?? 1080,
      contentHeight: props?.contentHeight ?? 1080,
    };

    this.app = new Application({
      backgroundColor: 0x555555,
      resolution: Math.min(Math.max(globalThis.devicePixelRatio, 1), 2),
    });

    this.world = new World(this.props);
    this.app.stage.addChild(this.world.root);

    this.resizeManager = new ResizeManager(this.app, this.props);

    Loader.registerPlugin(SpineParser);
  }

  public async loadAssets(configUrl: string): Promise<void> {
    type Config = {
      textures?: Readonly<Record<string, string>>;
      spineAnimations?: ReadonlyArray<string>;
    };
    const configData = await globalThis.fetch(configUrl);
    const config = (await configData.json()) as Config;
    const loader = Loader.shared;

    if (config.textures) {
      Object.entries(config.textures).forEach(([key, textureUrl]) => {
        loader.add(key, textureUrl);
      });
    }
    config.spineAnimations?.forEach((url) => {
      loader.add(url, url, (resource) => {
        const { spineData } = resource;
        if (!spineData) throw new Error('spineData is not defined');
        spineData.animations.forEach((animation) => {
          loader.resources[animation.name] = resource;
        });
      });
    });
    return new Promise((resolve) => loader.load(() => resolve()));
  }

  public get<TKey extends keyof ContextStore>(key: TKey): ContextStore[TKey] {
    const data = this.store[key];
    if (data === undefined) throw new Error(`Context store does not have ${String(key)} property`);
    return data;
  }

  public set<TKey extends keyof ContextStore>(key: TKey, value: ContextStore[TKey]): void {
    this.store[key] = value;
  }

  public has<TKey extends keyof ContextStore>(key: unknown): key is TKey {
    return typeof key === 'string' && key in this.store;
  }

  public start(): void {
    this.resizeManager.start();
  }

  public stop(): void {
    this.app.destroy(true);
    this.resizeManager.stop();
    Loader.shared.reset();
    utils.destroyTextureCache();
  }
}
