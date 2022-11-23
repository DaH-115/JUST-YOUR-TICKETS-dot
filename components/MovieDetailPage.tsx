import Image from 'next/image';
import { useRouter } from 'next/router';
import { AiOutlineArrowRight } from 'react-icons/ai';
import styled from 'styled-components';
import BackgroundStyle from './Layout/BackgroundStyle';

const MovieDetailPage = () => {
  const router = useRouter();
  const { title, releaseDate, posterImage, voteAverage, overview } =
    router.query;
  const janreArr = router.query.janre as string[];
  const fromTicketList = router.pathname.includes('ticket-list');

  return (
    <BackgroundStyle backgroundColor='black' customMessage='info✔️'>
      <DetailWrapper>
        <MovieDetails>
          {!posterImage ? (
            <ImgBox>
              <NoneImg>IMAGE IS NONE</NoneImg>
            </ImgBox>
          ) : (
            <ImgBox>
              <Image
                src={`https://image.tmdb.org/t/p/w500/${posterImage}`}
                alt={`${title} Image Poster`}
                width={360}
                height={560}
              />
            </ImgBox>
          )}
          <TextWrapper>
            <StyledLabeling>*영화 제목</StyledLabeling>
            <ContentText>
              <h1>
                {title}({releaseDate})
              </h1>
            </ContentText>
            <StyledLabeling>
              {fromTicketList ? `*나의 점수` : '*점수'}
            </StyledLabeling>
            <ContentText>
              <p>{voteAverage} /10</p>
            </ContentText>
            {janreArr && (
              <>
                <StyledLabeling>*장르</StyledLabeling>
                <ContentText>
                  <MovieJanreWrapper>
                    {janreArr.map((item, index) => (
                      <li key={index}>/ {item}</li>
                    ))}
                  </MovieJanreWrapper>
                </ContentText>
              </>
            )}

            <StyledLabeling>
              {fromTicketList ? `*나의 감상` : '*줄거리'}
            </StyledLabeling>
            <ContentText>
              <OverviweText>{overview}</OverviweText>
            </ContentText>
            <AdmitButtonWrapper>
              <button>ADMIT ONE</button>
              <ArrowBtn>
                <AiOutlineArrowRight />
              </ArrowBtn>
            </AdmitButtonWrapper>
          </TextWrapper>
        </MovieDetails>
      </DetailWrapper>
    </BackgroundStyle>
  );
};

const DetailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const MovieDetails = styled.div`
  width: 100%;
  max-width: 600px;
`;

const TextWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 1.5rem 1rem;
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
  background: linear-gradient(white 60%, ${({ theme }) => theme.colors.yellow});
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0px 0px 50px rgba(255, 255, 255, 0.4));
`;

const NoneImg = styled.div`
  width: 360px;
  height: 560px;
  font-weight: 700;
  color: black;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
  padding-top: 2rem;
`;

const StyledLabeling = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;

  &:first-child {
    margin-bottom: 0.6rem;
  }
`;

const ContentText = styled.div`
  width: 100%;
  font-size: 1.2rem;
  margin-bottom: 1rem;

  h1 {
    font-weight: 700;
    border-bottom: 2px solid ${({ theme }) => theme.colors.orange};
    padding-bottom: 0.5rem;
  }
`;

const MovieJanreWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  font-size: 1rem;
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  li {
    margin-right: 0.4rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
  line-height: 1.2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.orange};
`;

const AdmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 1rem;

  button {
    font-size: 1rem;
    font-weight: 700;
  }
`;

const ArrowBtn = styled.div`
  margin-left: 0.5rem;
`;

export default MovieDetailPage;
