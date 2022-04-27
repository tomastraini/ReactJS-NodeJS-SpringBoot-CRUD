import React, { FC } from 'react';
import styles from './Menu.module.scss';

interface MenuProps {}

const Menu: FC<MenuProps> = () => (
  <div className={styles.Menu}>
    Menu Component
  </div>
);

export default Menu;
