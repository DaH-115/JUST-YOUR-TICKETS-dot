import Link from 'next/link';
import styled from 'styled-components';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

interface AdmitBtnProps {
  title: string;
  releaseYear: string;
  posterPath?: string;
}

const AdmitBtn = ({ title, releaseYear, posterPath }: AdmitBtnProps) => {
  return (
    <Link
      href={{
        pathname: '/write',
        query: {
          title,
          releaseYear,
          posterImage: `https://image.tmdb.org/t/p/w500${posterPath}`,
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
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background: linear-gradient(#fff 80%, ${({ theme }) => theme.colors.yellow});
  border-radius: 0.2rem;

  border-left: 0.1rem dashed ${({ theme }) => theme.colors.orange};
  border-right: 0.5rem dotted ${({ theme }) => theme.colors.black};

  padding: 1rem;

  &:hover,
  &:active {
    button,
    div {
      color: ${({ theme }) => theme.colors.orange};
      transition: color 200ms ease-in-out;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    border-right: 0.3rem dotted ${({ theme }) => theme.colors.black};
  }
`;

const StyledBtn = styled.button`
  font-size: 1rem;
  font-weight: 700;
  background: #fff;

  ${({ theme }) => theme.device.tablet} {
    font-size: 0.9rem;
  }
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
