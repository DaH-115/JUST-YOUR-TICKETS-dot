import styled from 'styled-components';

const Loading = () => {
  return (
    <Background>
      <LoadingText>잠시만 기다려 주세요.</LoadingText>
    </Background>
  );
};

export default Loading;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.3);

  z-index: 9999;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
`;
