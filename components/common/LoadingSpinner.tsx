import styled from 'styled-components';

export const LoadingSpinner = () => {
  return (
    <BackgroundStyle>
      <LdsRing>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </LdsRing>
    </BackgroundStyle>
  );
};

const BackgroundStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.black};
`;

const LdsRing = styled.div`
  display: inline-block;
  position: relative;
  width: 4rem;
  height: 4rem;
  margin-top: 1rem;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 3.2rem;
    height: 3.2rem;
    margin: 0.4rem;
    border: 0.4rem solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
