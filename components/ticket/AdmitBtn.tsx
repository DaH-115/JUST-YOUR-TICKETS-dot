import Link from 'next/link';
import styled from 'styled-components';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

const AdmitBtn = ({
  title,
  releaseYear,
  posterPath,
}: {
  title: string;
  releaseYear: string;
  posterPath?: string;
}) => {
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

const AdmitBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.black};
  border-left: 0.2rem dashed ${({ theme }) => theme.colors.orange};

  button {
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
  }
`;

const ArrowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: auto;

  color: ${({ theme }) => theme.colors.yellow};
  padding: 0.5rem 0;
`;
