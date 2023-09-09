import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Layout = ({ children }: { children: ReactNode }) => {
  return <LayoutdWrapper>{children}</LayoutdWrapper>;
};

export default Layout;

const LayoutdWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;
`;
