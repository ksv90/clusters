import { ChangeEvent, useState } from 'react';

import styles from './inputs.module.css';

export type NumberInputProps = {
  readonly title: string;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly value?: number;
};

export function NumberInput(props: NumberInputProps) {
  const { title, min = 1, max = 1000, value, onChange } = props;
  const [data, setData] = useState(value?.toString() || min.toString());

  const changeHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.value) {
      setData('');
      return;
    }

    const targetValue = Number(target.value);

    if (Number.isNaN(targetValue)) {
      target.value = data.toString();
      return;
    }

    const stringValue = targetValue.toString();
    target.value = stringValue;
    setData(stringValue);
    onChange(targetValue);
  };

  const blurHandler = () => {
    const currentData = +data;
    if (!data || currentData < min) {
      setData(min.toString());
      onChange(min);
      console.warn(`value ${data} could not be set so corrected to ${min}`);
      return;
    }

    if (currentData > max) {
      setData(max.toString());
      onChange(max);
      console.warn(`value ${data} could not be set so corrected to ${max}`);
      return;
    }
  };

  return (
    <p className={styles['number-input']}>
      <label htmlFor={title}>{title}</label>
      <input id={title} type="number" value={data} min={min} max={max} onChange={changeHandler} onBlur={blurHandler} />
    </p>
  );
}
