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
          title: title,
          releaseYear: releaseYear,
          posterImage: `https://image.tmdb.org/t/p/w500/${posterPath}`,
        },
      }}
      as={`/write`}
    >
      <AdmitButtonWrapper>
        <button>
          <p>ADMIT ONE</p>
        </button>
        <ArrowBtn>
          <MdOutlineArrowForwardIos />
        </ArrowBtn>
      </AdmitButtonWrapper>
    </Link>
  );
};

export default AdmitBtn;

const AdmitButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.orange};

  button {
    color: ${({ theme }) => theme.colors.black};
    font-weight: 700;
    padding: 2rem 0;
  }
`;

const ArrowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.yellow};
  background-color: ${({ theme }) => theme.colors.black};
  padding: 0.5rem 0;
`;
