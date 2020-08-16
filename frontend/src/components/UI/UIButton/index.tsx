import React, { FC } from "react";
import styles from "./styles.module.sass";

export interface IUIButtonProps {
  title: string;
  disabled?: boolean;
  onClick?(): void;
  type?: 'button'|'submit'|'reset';
}

const UIButton: FC<IUIButtonProps> = ({ title, onClick, disabled, type}) => {
  return (
    <button className={styles.uiButton} disabled={disabled} onClick={onClick} type={type}>
      {title}
    </button>
  );
};

export default UIButton;
