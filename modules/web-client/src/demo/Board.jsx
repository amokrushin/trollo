import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './column';
import { colors } from './constants';
import reorder, { reorderQuoteMap } from './reorder';

const publishOnDragStart = (...args) => {console.log('onDragStart', ...args)};
const publishOnDragEnd = (...args) => {console.log('onDragEnd', ...args)};

const ParentContainer = styled.div`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: 100vh;

  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;


export default class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: this.props.initial,
            ordered: Object.keys(this.props.initial),
            autoFocusQuoteId: null,
        };
    }

    componentDidMount() {
        // eslint-disable-next-line no-unused-expressions
        injectGlobal`
      body {
        background: ${colors.blue.deep};
      }
    `;
    }

    onDragStart = (initial) => {
        publishOnDragStart(initial);

        this.setState({
            autoFocusQuoteId: null,
        });
    }

    onDragEnd = (result) => {
        publishOnDragEnd(result);

        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        // did not move anywhere - can bail early
        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
            return;
        }

        // reordering column
        if (result.type === 'COLUMN') {
            const ordered = reorder(
                this.state.ordered,
                source.index,
                destination.index
            );

            this.setState({
                ordered,
            });

            return;
        }

        const data = reorderQuoteMap({
            quoteMap: this.state.columns,
            source,
            destination,
        });

        this.setState({
            columns: data.quoteMap,
            autoFocusQuoteId: data.autoFocusQuoteId,
        });
    }

    render() {
        const columns = this.state.columns;
        const ordered = this.state.ordered;
        const { containerHeight } = this.props;

        const board = (
            <Droppable
                droppableId="board"
                type="COLUMN"
                direction="horizontal"
                ignoreContainerClipping={true}
            >
                {(provided) => (
                    <Container innerRef={provided.innerRef} {...provided.droppableProps}>
                        {ordered.map((key, index) => (
                            <Column
                                key={key}
                                index={index}
                                title={key}
                                quotes={columns[key]}
                                autoFocusQuoteId={this.state.autoFocusQuoteId}
                            />
                        ))}
                    </Container>
                )}
            </Droppable>
        );

        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                {this.props.containerHeight ? (
                    <ParentContainer height={containerHeight}>{board}</ParentContainer>
                ) : (
                    board
                )}
            </DragDropContext>
        );
    }
}