import React from 'react';
import { ListGroup } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faFilter, faRocket, faEllipsisH, faUserPlus } from '@fortawesome/fontawesome-free-solid';
import { faImage, faStickyNote, faListAlt } from '@fortawesome/fontawesome-free-regular';
import styles from './BoardPageMenu.scss';
import { Button } from '../components/index';

const BoardPageMenu = (props) => (
    <ListGroup className={styles.list}>
        <div className={styles.listHeading}>Меню</div>
        <div className={styles.item}>
            <div className={styles.itemName}>Участники</div>
            <ul>
                {
                    props.board.organization.members.map(member => (
                        <li key={member.id}>
                            <span>{member.user.id}</span>{' '}
                            <span>{member.role}</span>
                        </li>
                    ))
                }
            </ul>
            <Button size="sm" block color="light" className={styles.btn}>
                <span className={styles.icon}><FontAwesomeIcon icon={faUserPlus} /></span>{' '}
                <span>Пригласить</span>
            </Button>
        </div>
        <div className={styles.item}>
            <Button size="sm" block color="transparent" className={styles.btn}>
                <span className={styles.icon}><FontAwesomeIcon icon={faImage} /></span>{' '}
                <span>Сменить фон</span>
            </Button>
            <Button size="sm" block color="transparent" className={styles.btn}>
                <span className={styles.icon}><FontAwesomeIcon icon={faFilter} /></span>{' '}
                <span>Фильтр карточек</span>
            </Button>
            <Button size="sm" block color="transparent" className={styles.btn}>
                <span className={styles.icon}><FontAwesomeIcon icon={faRocket} /></span>{' '}
                <span>Улучшения</span>
            </Button>
            <Button size="sm" block color="transparent" className={styles.btn}>
                <span className={styles.icon}><FontAwesomeIcon icon={faStickyNote} /></span>{' '}
                <span>Стикеры</span>
            </Button>
            <Button size="sm" block color="transparent" className={styles.btn}>
                <span className={styles.icon}><FontAwesomeIcon icon={faEllipsisH} /></span>{' '}
                <span>Еще</span>
            </Button>
        </div>
        <div className={styles.item}>
            <Button size="sm" block color="transparent" className={styles.btn}>
                <FontAwesomeIcon icon={faListAlt} />{' '}
                <span>Действия</span>
            </Button>
        </div>
    </ListGroup>
);

export default BoardPageMenu;
