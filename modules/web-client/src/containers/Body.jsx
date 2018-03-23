import React from 'react';
import { Route } from 'react-router-dom';
import Home from './HomePage';
import BoardPage from './BoardPage';
import DemoDndPage from '../demo/DemoDndPage';

export default (props) => (
    <div className={props.className}>
        <Route exact path="/" component={Home} />
        <Route path="/boards/:boardId" component={BoardPage} />
        <Route exact path="/demo-dnd" component={DemoDndPage} />
    </div>
);
