import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import withDragDropContext from '../libs/withDragDropContext';
import '../styles/bootstrap.scss?global';
import styles from './App.scss';


import Header from './Header';
import Body from './Body';

const App = () => (
    <div className={styles.container}>
        <Router>
            <Header className={styles.header} />
        </Router>
        <Router>
            <Body className={styles.body} />
        </Router>
    </div>
);

export default hot(module)(withDragDropContext(App));
