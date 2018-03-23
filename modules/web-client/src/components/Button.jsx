import React from 'react';
import { Button } from 'reactstrap';
import styles from '../components/Button.scss';

export default (props) => (
    <Button {...props} cssModule={styles} />
);
