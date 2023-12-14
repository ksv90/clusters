import { gsap } from 'gsap';
import { Container, Graphics, Text } from 'pixi.js';

export const SYMBOL_WIDTH = 200;
export const SYMBOL_HEIGHT = 200;
export const COLOR_RATIO = 1_000_000;
export const FRAME_SIZE = 6;

function createRect(x: number, y: number, width: number, height: number, color: number) {
  const rect = new Graphics();
  rect.beginFill(color);
  rect.drawRect(x, y, width, height);
  rect.endFill();
  return rect;
}

export class SymbolView {
  public container = new Container();

  public width = SYMBOL_WIDTH;

  public height = SYMBOL_HEIGHT;

  protected activeTween?: gsap.core.Timeline;

  constructor(public id: number) {
    const hulfSize = FRAME_SIZE / 2;
    const outer = createRect(0, 0, this.width, this.height, 0x000000);
    const inner = createRect(hulfSize, hulfSize, this.width - FRAME_SIZE, this.height - FRAME_SIZE, id * COLOR_RATIO);
    this.container.addChild(outer, inner);
    this.container.pivot.set(this.width / 2, this.height / 2);
  }

  public showActive(delay: number) {
    this.container.removeChildren();
    const rect = createRect(0, 0, this.width, this.height, this.id * COLOR_RATIO);
    const text = new Text('!', { fontFamily: 'Arial', fontSize: 100, fill: 'red' });
    text.anchor.set(0.5);
    text.position.set(this.width / 2, this.height / 2);
    this.container.addChild(rect, text);
    this.activeTween = gsap
      .timeline({ repeat: -1, delay })
      .to(text, { duration: 1, alpha: 0 })
      .to(text, { duration: 1, alpha: 1 });
  }

  public remove() {
    this.activeTween?.clear();
    this.container.destroy(true);
  }
}
