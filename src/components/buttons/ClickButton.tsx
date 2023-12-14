import styles from './buttons.module.css';

export type ClickButtonProps = {
	readonly title: string;
	readonly onClick?: () => void;
};

export function ClickButton(props: ClickButtonProps) {
	const { title, onClick } = props;
	return (
		<button onClick={onClick} className={styles['click-button']}>
			{title}
		</button>
	);
}
