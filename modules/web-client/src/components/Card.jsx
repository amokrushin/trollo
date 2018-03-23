import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import styles from './Card.scss';

const Card = ({ card }) => (
    <div className={styles.card}>
        <div className={styles.labels} />
        <div className={styles.title}>
            {card.name}
        </div>
        <div className={styles.badges} />
        <div className={styles.members} />
    </div>
);

const CardWrapper = ({ card, isDragging, connectDragSource, connectDropTarget }) => connectDragSource(connectDropTarget(
    <div className={styles.outerWrapper}>
        <div className={styles.innerWrapper}>
            <Card card={card} />
        </div>
    </div>,
));

const cardSource = {
    beginDrag(props) {
        return {
            card: props.card,
        };
    },

    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            alert(`You dropped ${item.name} into ${dropResult.name}!`); // eslint-disable-line no-alert
        }
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        console.log('hover');
    },
};

// export default CardWrapper;
export default DropTarget(
    'foo',
    cardTarget,
    (connect) => ({
        connectDropTarget: connect.dropTarget(),
    }),
)(DragSource(
    'foo',
    cardSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }),
)(CardWrapper));
