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
        <button>
          <p>ADMIT ONE</p>
        </button>
        <ArrowBtn>
          <MdOutlineArrowForwardIos />
        </ArrowBtn>
      </AdmitBtnWrapper>
    </Link>
  );
};

export default AdmitBtn;

const ArrowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: auto;

  color: ${({ theme }) => theme.colors.black};
  padding: 0.5rem 0;
`;

const AdmitBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  background: linear-gradient(white 80%, ${({ theme }) => theme.colors.yellow});

  border-left: 0.4rem dotted ${({ theme }) => theme.colors.black};
  border-right: 0.4rem dotted ${({ theme }) => theme.colors.black};
  border-radius: 0.2rem;

  padding: 1rem;
  padding-bottom: 0;

  button {
    writing-mode: vertical-rl;
    font-size: 1rem;
    font-weight: 700;
    background: #fff;
  }

  &:hover,
  &:active {
    div {
      color: ${({ theme }) => theme.colors.orange};
      transition: color 200ms ease-in-out;
    }
  }
`;
