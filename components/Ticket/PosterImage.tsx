import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

interface PosterImageProps {
  title: string;
  posterImage?: string;
  posterPath?: string;
}

const PosterImage = ({ title, posterImage, posterPath }: PosterImageProps) => {
  const posterSrc = posterImage
    ? posterImage
    : posterPath
    ? `https://image.tmdb.org/t/p/w500/${posterPath}`
    : '';

  return (
    <ImgBox>
      {!posterImage && !posterPath ? (
        <NoneImg>IMAGE IS NONE</NoneImg>
      ) : (
        <Image src={posterSrc} alt={title} width={320} height={480} />
      )}
    </ImgBox>
  );
};

export default React.memo(PosterImage);

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;

  img {
    border-radius: 1.5rem;
  }
`;

const NoneImg = styled.div`
  width: ${({ theme }) => theme.posterWidth};
  height: ${({ theme }) => theme.posterHeight};
  font-weight: 700;
  color: black;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
`;
