import { Container, Graphics, Loader, Sprite } from 'pixi.js';
import { Spine } from 'pixi-spine';

import { Cell, CELL_HEIGHT, CELL_WIDTH, Context, NextAction, SymbolView } from '../game';
import { fetchData } from '../server';

export function createGrid(context: Context, next: NextAction) {
  const { world, props } = context;
  const cols = context.get('cols');
  const rows = context.get('rows');

  const container = new Container();

  const width = cols * CELL_WIDTH;
  const height = rows * CELL_HEIGHT;

  new Array(cols).fill(0).flatMap((_, col) => {
    return new Array(rows).fill(0).map((_, row) => {
      const cell = new Cell(col, row);
      container.addChild(cell.container);
      world.cells.add(cell);
    });
  });

  container.pivot.set(width / 2, height / 2);

  if (width > props.contentWidth || height > props.contentHeight) {
    const scale = Math.min(props.contentWidth / width, props.contentHeight / height);
    container.scale.set(scale);
  }

  world.root.addChild(container);

  next();
}

export async function loadData(context: Context) {
  const { world } = context;
  const cols = context.get('cols');
  const rows = context.get('rows');
  const symbols = context.get('symbols');
  const size = context.get('clusterSize');

  const { symbols: serverSymbols, win } = await fetchData({ cols, rows, symbols, size });
  serverSymbols.forEach(({ id, position }) => {
    const cell = world.getCell(position.x, position.y);
    cell.symbol = new SymbolView(id);
  });

  context.set('win', win);
}

export function win(context: Context, next: NextAction) {
  const { world } = context;
  const win = context.get('win');
  if (!win) throw new Error('win Error');
  win.clusters.forEach(({ symbols }, i) => {
    symbols.forEach(({ position }) => {
      const cell = world.getCell(position.x, position.y);
      cell.symbol.showActive(i / 5);
    });
  });
  next();
}

export function clear(context: Context, next: NextAction) {
  const { world } = context;
  world.cells.forEach((cell) => cell.clear());
  next();
}

export async function loadAssets(context: Context) {
  await context.loadAssets('asset.json');
  const { resources } = Loader.shared;
  const OFFSET = 150;
  const doubleOffset = OFFSET * 2;

  const coordinates = [
    [-OFFSET, 0],
    [OFFSET, 0],
    [-OFFSET, -OFFSET],
    [OFFSET, -OFFSET],
    [-OFFSET, OFFSET],
    [OFFSET, OFFSET],
    [0, -OFFSET],
    [0, OFFSET],
    [-doubleOffset, -OFFSET],
    [doubleOffset, -OFFSET],
    [-doubleOffset, OFFSET],
    [doubleOffset, OFFSET],
    [-doubleOffset, 0],
    [doubleOffset, 0],
    [0, 0],
  ];

  const sprites = ['sym-01', 'sym-02', 'sym-03', 'sym-04', 'sym-05', 'sym-06', 'sym-07', 'sym-08'].map((name) => {
    const { texture } = resources[name];
    if (!texture) throw new Error(`texture ${name} error`);
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.scale.set(0.5);
    sprite.position.set(...coordinates.shift()!);
    return sprite;
  });

  const spines = [
    'sym-01-idle',
    'sym-02-idle',
    'sym-03-idle',
    'sym-04-idle',
    'sym-05-idle',
    'sym-06-idle',
    'sym-0-idle',
  ].map((name, index) => {
    const { spineData } = resources[name];
    if (!spineData) throw new Error(`spineData ${name} error`);
    const spine = new Spine(spineData);
    spine.scale.set(0.5);
    spine.state.setAnimation(0, name, index > 3);
    spine.position.set(...coordinates.shift()!);
    return spine;
  });

  const graphics = new Graphics().beginFill(0xcccccc).drawRect(0, 0, 800, 500).endFill();
  graphics.pivot.set(graphics.width / 2, graphics.height / 2);
  graphics.alpha = 0.8;

  context.world.testContainer.addChild(graphics, ...sprites, ...spines);
  context.world.root.addChild(context.world.testContainer);
}
