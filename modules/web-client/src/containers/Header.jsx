import React from 'react';
import { Col, Button } from 'reactstrap';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTh, faUser, faBell, faPlus, faInfo } from '@fortawesome/fontawesome-free-solid';
import HeaderPlusButton from '../components/HeaderPlusButton';
import styles from './Header.scss';

export default (props) => (
    <div className={classNames(props.className, styles.container)}>
        <Col>
            <Button color="light" size="sm" className={styles.button}>
                <FontAwesomeIcon icon={faTh} /> Доски
            </Button>
        </Col>
        <Col className="text-right">
            <HeaderPlusButton color="light" size="sm" className={styles.button}>
                <FontAwesomeIcon icon={faPlus} />
            </HeaderPlusButton>
            {' '}
            <Button color="light" size="sm" className={styles.button}>
                <FontAwesomeIcon icon={faInfo} />
            </Button>
            {' '}
            <Button color="light" size="sm" className={styles.button}>
                <FontAwesomeIcon icon={faBell} />
            </Button>
            {' '}
            <Button color="light" size="sm" className={styles.button}>
                <FontAwesomeIcon icon={faUser} />
            </Button>
        </Col>
    </div>
);
