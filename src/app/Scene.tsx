import { useEffect, useMemo, useRef } from 'react';

import { Game, GameOptions } from '../game';
import { createMachineConfig } from '../states';
import styles from './app.module.css';

export type SceneOption = GameOptions['scene'];

export type SceneProps = {
  readonly option: SceneOption;
  readonly showTestContainer: boolean;
};

export function Scene(props: SceneProps) {
  const { option, showTestContainer } = props;

  const container = useRef<HTMLDivElement>(null);
  const game = useMemo(() => new Game({ scene: option }), [option]);

  useEffect(() => {
    if (!container.current) throw new Error('container error');
    container.current.append(game.canvas);
    game.start(createMachineConfig());
    return () => {
      game.canvas.remove();
      game.stop();
    };
  }, [option]);

  useEffect(() => {
    game.toggleTestContainer(showTestContainer);
  }, [showTestContainer]);

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
