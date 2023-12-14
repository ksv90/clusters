import { Container } from 'pixi.js';

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
