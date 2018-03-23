import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faUsers, faEllipsisH } from '@fortawesome/fontawesome-free-solid';
import { faStar } from '@fortawesome/fontawesome-free-regular';
import { Button } from '../components/index';
import styles from './BoardPageHeader.scss';

const BoardPageHeader = (props) => {
    return (
        <div className={styles.header}>
            <Button size="sm" color="transparent-inverted" className={styles.btnBoardName}>
                {props.board.name}
            </Button>
            <Button size="sm" color="transparent-inverted" className={styles.btnStar}>
                <FontAwesomeIcon icon={faStar} />
            </Button>
            <Button size="sm" color="transparent-inverted" className={styles.btnBoardType}>
                <FontAwesomeIcon icon={faUsers} />{' '}
                <span>Командная</span>
            </Button>
            <Button size="sm" color="transparent-inverted" className={styles.btnMenu} onClick={props.toggleSidebar}>
                <FontAwesomeIcon icon={faEllipsisH} />{' '}
                <span>Меню</span>
            </Button>
        </div>
    );
};

export default BoardPageHeader;
