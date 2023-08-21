import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

interface PosterImageProps {
  title: string;
  releaseYear: string;
  posterImage?: string;
  posterPath?: string;
}

const PosterImage = ({
  title,
  releaseYear,
  posterImage,
  posterPath,
}: PosterImageProps) => {
  const posterSrc = posterImage
    ? posterImage
    : posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : '';

  return (
    <ImgContainer>
      {!posterImage && !posterPath ? (
        <ImgContainer>{`${title}(${releaseYear})`}</ImgContainer>
      ) : (
        <Image
          src={posterSrc}
          alt={`${title}(${releaseYear})`}
          width={320}
          height={480}
          unoptimized
        />
      )}
    </ImgContainer>
  );
};

export default React.memo(PosterImage);

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${({ theme }) => theme.posterWidth};
  height: ${({ theme }) => theme.posterHeight};
  border-radius: 1.5rem;

  color: #fff;
  background-color: ${({ theme }) => theme.colors.black};

  img {
    border-radius: 1.5rem;
  }
`;
