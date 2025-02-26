import { useState } from 'react';

import { ClickButton } from '../components/buttons';
import styles from './app.module.css';
import { CreateForm } from './CreateForm';
import { Scene, SceneProps } from './Scene';

export function App() {
  const [showForm, setShowForm] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showTestContainer, setShowTestContainer] = useState(false);
  const [scene, setScene] = useState({ cols: 5, rows: 3, symbols: 5, clusterSize: 3 });

  const playClickButtonHandler = () => {
    setShowForm(true);
  };

  const stopClickButtonHandler = () => {
    setShowGame(false);
    setShowTestContainer(true);
  };

  const createGameHandler = (sceneData: SceneProps['option']) => {
    setScene(sceneData);
    setShowForm(false);
    setShowGame(true);
  };

  const closeFormClickHandler = () => {
    setShowForm(false);
  };

  return (
    <>
      {showGame && <Scene showTestContainer={showTestContainer} option={scene} />}
      <div className={styles['head-container']}>
        <h1>Clusters - играй в настоящую</h1>
        <p className={[styles['left-align']].join()}>
          <ClickButton title="Play game" onClick={playClickButtonHandler} />
          <ClickButton title="Stop game" onClick={stopClickButtonHandler} />
        </p>
      </div>
      {showForm && <CreateForm scene={scene} onSend={createGameHandler} onClose={closeFormClickHandler} />}
    </>
  );
}
