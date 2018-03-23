import React from 'react';
import classNames from 'classnames';
import styles from './Sidebar.scss';

const Sidebar = (props) => {
    return (
        <div className={classNames(styles.container, { [styles.containerWithSidebar]: props.isOpen })}>
            <div className={styles.main}>
                {props.body}
            </div>
            <div className={styles.side}>
                {props.sidebar}
            </div>
        </div>
    );
};

export default Sidebar;
