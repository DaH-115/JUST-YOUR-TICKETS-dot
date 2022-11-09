import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styled from 'styled-components';

import MovieDetail from './MovieDetail';

interface TicketProps {
  id: number;
  voteAverage: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
}

const Ticket = ({ ...props }: TicketProps) => {
  const [gen, setGen] = useState([]);
  const movieId = props.id;

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data = await res.data;

      const result = data.genres.map(
        (item: { id: number; name: string }) => item.name
      );

      setGen(result);
    })();
  }, [movieId]);

  return (
    <>
      <Wrapper>
        {!props.posterPath ? (
          <ImgBox>
            <NoneImg>IMAGE IS NONE</NoneImg>
          </ImgBox>
        ) : (
          <ImgBox>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${props.posterPath}`}
              alt={props.title}
              width={350}
              height={550}
            />
          </ImgBox>
        )}
        <MovieDetail
          title={props.title}
          releaseDate={props.releaseDate}
          rating={props.voteAverage}
          desc={props.overview}
          janre={gen}
        />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: auto;
  height: 100%;
  margin-right: 1rem;
  filter: drop-shadow(0px 0px 20px rgba(2, 2, 2, 0.7));
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
`;

const NoneImg = styled.div`
  width: 350px;
  height: 550px;
  font-weight: 700;
  color: black;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
`;

export default Ticket;
