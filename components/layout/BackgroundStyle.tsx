import React, { ReactNode } from 'react';
import styled from 'styled-components';

const BackgroundStyle = ({ children }: { children: ReactNode }) => {
  return <BackgroundWrapper>{children}</BackgroundWrapper>;
};

export default BackgroundStyle;

const BackgroundWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
