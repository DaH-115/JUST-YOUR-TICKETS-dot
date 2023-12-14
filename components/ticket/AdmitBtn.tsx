import Link from 'next/link';
import styled from 'styled-components';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

interface AdmitBtnProps {
  movieId: number;
}

const AdmitBtn = ({ movieId }: AdmitBtnProps) => {
  return (
    <Link
      href={{
        pathname: '/write',
        query: {
          movieId,
        },
      }}
      as={`/write`}
    >
      <AdmitBtnWrapper>
        <StyledBtn>
          <BtnText>{'ADMIT ONE'}</BtnText>
        </StyledBtn>
        <ArrowBtn>
          <MdOutlineArrowForwardIos />
        </ArrowBtn>
      </AdmitBtnWrapper>
    </Link>
  );
};

export default AdmitBtn;

const AdmitBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  background: linear-gradient(#fff 80%, ${({ theme }) => theme.colors.yellow});
  background-color: #fff;
  border-radius: 0 0.5rem 0.5rem 0;

  border-left: 0.1rem dashed ${({ theme }) => theme.colors.orange};

  padding: 1rem;

  &:hover,
  &:active {
    button,
    div {
      color: ${({ theme }) => theme.colors.orange};
      transition: color 200ms ease-in-out;
    }
  }
`;

const StyledBtn = styled.button`
  font-size: 1rem;
  font-weight: 700;
  background: #fff;
`;

const BtnText = styled.p`
  writing-mode: vertical-rl;
`;

const ArrowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  color: ${({ theme }) => theme.colors.black};
  margin-top: 0.2rem;
`;
