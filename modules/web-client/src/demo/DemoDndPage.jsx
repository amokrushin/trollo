import React from 'react';
import styled from 'styled-components';
import Board from './Board';
import { generateQuoteMap } from './data';

const data = {
    medium: generateQuoteMap(15),
};

const Wrapper = styled.div`
  display: block;
  overflow-x: auto;
  overflow-y: hidden;
`;

const DemoDndPage = () => (
    <Wrapper>
        <Board initial={data.medium} />
    </Wrapper>
);

export default DemoDndPage;
