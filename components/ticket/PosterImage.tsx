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
    <ImgWrapper>
      {!posterImage && !posterPath ? (
        <ImgWrapper>{`${title}(${releaseYear})`}</ImgWrapper>
      ) : (
        <Image
          src={posterSrc}
          alt={`${title}(${releaseYear})`}
          width={320}
          height={480}
          unoptimized
        />
      )}
    </ImgWrapper>
  );
};

export default React.memo(PosterImage);

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    border-radius: 1.5rem;
  }
`;
