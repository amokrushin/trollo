import React, { Component } from 'react';
import withScrolling from 'react-dnd-scrollzone';
import List from '../components/List';
import styles from './Board.scss';

const Lists = ({ lists }) => lists.map((list, index) => (
    <List
        key={list.id}
        index={index}
        list={list}
    />
));

const ScrollingComponent = withScrolling('div');

export default class Board extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollingComponent className={styles.scrollableWrapper}>
                <div
                    id="viewport"
                    className={styles.board}
                >
                    <Lists lists={this.props.board.lists} />
                </div>
            </ScrollingComponent>
        );
    }
}
