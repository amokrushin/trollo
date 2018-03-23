import React from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, ListGroup } from 'reactstrap';
import styles from './HeaderPlusButton.scss';

const ButtonPlusDropdown = (props) => (
    <UncontrolledDropdown className={styles.dropdown}>
        <DropdownToggle {...props}>
            {props.children}
        </DropdownToggle>
        <DropdownMenu className={styles.menu}>
            <ListGroup className={styles.list}>
                <div className={styles.listHeading}>Создание</div>
                <Link to="/create-board" className={styles.item}>
                    <div className={styles.itemName}>Карточки</div>
                    <div className={styles.itemSubname}>Доска представляет собой совокупность карточек, упорядоченных в
                        списках.
                    </div>
                </Link>
                <Link to="/create-organization" className={styles.item}>
                    <div className={styles.itemName}>Команды</div>
                    <div className={styles.itemSubname}>Команда представляет собой группу досок и людей.</div>
                </Link>
            </ListGroup>
        </DropdownMenu>
    </UncontrolledDropdown>
);

export default ButtonPlusDropdown;
