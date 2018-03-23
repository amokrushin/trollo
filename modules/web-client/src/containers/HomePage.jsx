import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/fontawesome-free-solid';
import { has } from 'lodash';
import { selectHydrated } from '../reducers/organizations';
import { LoaderPacman } from '../components';
import styles from './HomePage.scss';

const Board = (props) => (
    <Link to={`/boards/${props.id}`} className={classNames([props.className, styles.board])}>
        <div className={styles.title}>{props.name}</div>
    </Link>
);

const Organization = (props) => {
    const isReady = [
        'id',
        'name',
        'boards',
    ].every(prop => has(props, prop));

    if (!isReady) {
        return (
            <div>
                <LoaderPacman color="lightgray" />
            </div>
        );
    }

    return (
        <div className={styles.organization}>
            <div className={styles.title}>
                <span className={classNames(styles.icon, props.name ? styles.group : styles.personal)}>
                    <FontAwesomeIcon icon={props.name ? faUsers : faUser} />
                </span>
                <span>
                    {props.name || 'Персональные доски'}
                </span>
            </div>
            <div className={styles.list}>
                {
                    props.boards.map(board => (
                        <Board key={board.id} {...board} className={styles.item} />
                    ))
                }
                <Board
                    name="Создать новую доску…"
                    className={classNames(styles.item, styles.boardNew, styles.action)}
                />
            </div>
        </div>
    );
};

class Home extends React.Component {
    componentDidMount() {
        this.props.loadUserOrganizations();
    }

    render() {
        return (
            <Container>
                {
                    this.props.organizations.map(organization => (
                        <Organization key={organization.id} {...organization} />
                    ))
                }
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    organizations: selectHydrated(state),
});

function mapDispatchToProps(dispatch) {
    return {
        loadUserOrganizations() {
            return dispatch({ type: 'FETCH_USER_ORGANIZATIONS' });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
