import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pacman } from 'loaders.css/src/animations/pacman.scss';

const LoaderPacman = (props) => {
    const pacmanStyle = {
        borderTopColor: props.color,
        borderLeftColor: props.color,
        borderBottomColor: props.color,
    };
    const dotStyle = {
        backgroundColor: props.color,
    };
    return (
        <div className={classNames(pacman, props.className)}>
            <div style={pacmanStyle} />
            <div style={pacmanStyle} />
            <div style={dotStyle} />
            <div style={dotStyle} />
            <div style={dotStyle} />
        </div>
    );
};

LoaderPacman.propTypes = {
    color: PropTypes.string,
};

LoaderPacman.defaultProps = {
    color: 'white',
};

export default LoaderPacman;
