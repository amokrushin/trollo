import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/fontawesome-free-solid';
import withScrolling from 'react-dnd-scrollzone';
import { DropTarget } from 'react-dnd';
import { Button } from '../components';
import Card from './Card';
import styles from './List.scss';


const Cards = ({ cards }) => cards.map((card, index) => (
    <Card
        key={card.id}
        index={index}
        card={card}
    />
));

const ListHeader = ({ list }) => (
    <div className={styles.listHeader}>
        <Button size="sm" color="transparent" className={styles.btnName}>
            {list.name}
        </Button>
        <Button size="sm" color="transparent" className={styles.btnMenu}>
            <FontAwesomeIcon icon={faEllipsisH} />{' '}
        </Button>
    </div>
);

const ListBody = ({ list }) => (
    <div className={styles.listBody}>
        <Cards cards={list.cards} />
    </div>
);

const ListFooter = ({ list }) => (
    <div className={styles.listFooter}>
        Footer
    </div>
);

const ScrollingComponent = withScrolling('div');

const List = ({ list }) => (
    <div className={styles.list}>
        <ListHeader list={list} />
        <ScrollingComponent className={styles.listBody}>
            <Cards cards={list.cards} />
        </ScrollingComponent>
        <ListFooter list={list} />
    </div>
);

const ListWrapper = ({ list, index }) => (
    <div className={styles.outerWrapper}>
        <div className={styles.innerWrapper}>
            <List index={index} list={list} />
        </div>
    </div>
);


export default ListWrapper;
