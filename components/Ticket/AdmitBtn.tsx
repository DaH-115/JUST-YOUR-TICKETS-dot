import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
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
  const route = useRouter();

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
<<<<<<< HEAD
      <AdmitButtonWrapper>
=======
      <AdmitButtonWrapper searchState={route.asPath}>
>>>>>>> 6891abff4543fcdd0ed9ec34420847ef66d9e308
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

<<<<<<< HEAD
const AdmitButtonWrapper = styled.div`
=======
const AdmitButtonWrapper = styled.div<{ searchState: string }>`
>>>>>>> 6891abff4543fcdd0ed9ec34420847ef66d9e308
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.orange};
<<<<<<< HEAD
=======
  border-top-left-radius: ${({ searchState }) =>
    searchState ? 'none' : '1rem'};
  border-bottom-right-radius: ${({ searchState }) =>
    searchState ? 'none' : '1.5rem'};
>>>>>>> 6891abff4543fcdd0ed9ec34420847ef66d9e308

  button {
    font-weight: 700;
    padding: 2rem 0;

    p {
      font-weight: bolder;
    }
  }
`;

const ArrowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.black};
  color: #fff;
  padding: 0.4rem 0;
`;
