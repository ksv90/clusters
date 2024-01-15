import { MouseEvent, useState } from 'react';

import { ClickButton } from '../components/buttons';
import { NumberInput } from '../components/inputs';
import styles from './app.module.css';
import { SceneOption } from './Scene';

export type CreateFormProps = {
  readonly scene: SceneOption;
  readonly onSend: (scene: SceneOption) => void;
  readonly onClose?: () => void;
};

export function CreateForm(props: CreateFormProps) {
  const { scene, onSend, onClose } = props;
  const [cols, setCols] = useState(scene.cols);
  const [rows, setRows] = useState(scene.rows);
  const [symbols, setSymbols] = useState(scene.symbols);
  const [clusterSize, setClusterSize] = useState(scene.clusterSize);

  const sendHandler = () => {
    onSend({ cols, rows, symbols, clusterSize });
  };

  const closeHandler = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const target = event.target as HTMLDivElement; // globalThis.MouseEvent type error
    if (target.closest(`.${styles['form']}`)) return;
    onClose?.();
  };

  return (
    <>
      <div onClick={closeHandler} className={styles['form-container']}>
        <div className={styles['form']}>
          <h2>game creation form</h2>
          <NumberInput title="cols" onChange={setCols} value={scene.cols} min={5} max={50} />
          <NumberInput title="rows" onChange={setRows} value={scene.rows} min={3} max={30} />
          <NumberInput title="symbols" onChange={setSymbols} value={scene.symbols} min={2} max={15} />
          <NumberInput title="cluster size" onChange={setClusterSize} value={scene.clusterSize} min={3} />
          <p className={styles['buttons-wrap']}>
            <ClickButton title="create new game" onClick={sendHandler} />
            <ClickButton title="cancel" onClick={onClose} />
          </p>
        </div>
      </div>
    </>
  );
}
