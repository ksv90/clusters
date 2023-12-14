import { Container } from 'pixi.js';

import { SymbolView } from '../game';

export const CELL_WIDTH = 200;
export const CELL_HEIGHT = 200;

export type Location = {
  readonly col: number;
  readonly row: number;
};

export class Cell {
  public container = new Container();

  public location: Location;

  protected currentSymbols: SymbolView | null = null;

  constructor(col: number, row: number) {
    this.location = { col, row };
    this.container.position.set(col * CELL_WIDTH, row * CELL_HEIGHT);
    this.container.pivot.set(-CELL_WIDTH / 2, -CELL_HEIGHT / 2);
  }

  set symbol(symbol: SymbolView) {
    if (this.currentSymbols) this.container.removeChild(this.currentSymbols.container);
    this.currentSymbols = symbol;
    this.container.addChild(symbol.container);
  }

  get symbol(): SymbolView {
    if (!this.currentSymbols) throw new Error('symbol error');
    return this.currentSymbols;
  }

  public clear() {
    this.currentSymbols?.remove();
  }
}
