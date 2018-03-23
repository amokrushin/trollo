import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { has } from 'lodash';
import { selectHydrated } from '../reducers/boards';
import styles from './BoardPage.scss';
import { LoaderPacman } from '../components';
import Sidebar from '../components/Sidebar';
import BoardPageHeader from './BoardPageHeader';
import BoardPageMenu from './BoardPageMenu';
import Board from './Board';

class BoardPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isSidebarOpen: false };
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    componentDidMount() {
        this.props.loadBoard();
    }

    get isReady() {
        return this.props.board && [
            'id',
            'lists',
            'name',
            'organization',
            'organization.members',
        ].every(prop => has(this.props.board, prop));
    }

    toggleSidebar() {
        this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
    }

    render() {
        if (!this.isReady) {
            return (
                <div className={classNames(styles.container, styles.center)}>
                    <LoaderPacman color={styles.loaderColor} />
                </div>
            );
        }

        const body = (
            <div className={styles.container}>
                <BoardPageHeader board={this.props.board} toggleSidebar={this.toggleSidebar} />
                <div className={styles.main}>
                    <Board board={this.props.board} />
                </div>
            </div>
        );

        const sidebar = <BoardPageMenu board={this.props.board} />;

        return <Sidebar isOpen={this.state.isSidebarOpen} body={body} sidebar={sidebar} />;
    }
}

const mapStateToProps = (state, ownProps) => ({
    board: selectHydrated(state, ownProps.match.params.boardId),
});

function mapDispatchToProps(dispatch, ownProps) {
    return {
        loadBoard() {
            return dispatch({
                type: 'FETCH_BOARD',
                board: { id: ownProps.match.params.boardId },
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
