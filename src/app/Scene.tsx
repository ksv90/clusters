import { useEffect, useRef } from 'react';

import { Game, GameOptions } from '../game';
import { createMachineConfig } from '../states';
import styles from './app.module.css';

export type SceneOption = GameOptions['scene'];

export type SceneProps = {
  readonly option: SceneOption;
};

export function Scene(props: SceneProps) {
  const { option } = props;

  const container = useRef<HTMLDivElement>(null);
  const game = new Game({ scene: option });

  useEffect(() => {
    if (!container.current) throw new Error('container error');
    container.current.append(game.canvas);
    game.start(createMachineConfig());
    return () => {
      game.canvas.remove();
      game.stop();
    };
  }, [option]);

  const refreshClickHandler = () => {
    game.next();
  };

  return (
    <div ref={container} className={styles['canvas-container']}>
      <div onClick={refreshClickHandler}>
        <span>refresh</span>
      </div>
    </div>
  );
}
