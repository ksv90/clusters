import { Container } from 'pixi.js';

import { Cell } from './Cell';

export type WorldProps = {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
};

export class World {
  public cells = new Set<Cell>();

  public root = new Container();

  constructor(props?: WorldProps) {
    const { canvasWidth = 1920, canvasHeight = 1920 } = props ?? {};
    this.root.position.set(canvasWidth / 2, canvasHeight / 2);
  }

  public getCell(col: number, row: number): Cell {
    let cell: Cell | undefined;
    this.cells.forEach((currentCell) => {
      if (currentCell.location.col !== col || currentCell.location.row !== row) return;
      cell = currentCell;
    });
    if (!cell) throw new Error('cell error');
    return cell;
  }
}
