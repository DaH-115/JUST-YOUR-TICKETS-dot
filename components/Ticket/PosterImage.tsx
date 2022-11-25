import Image from 'next/image';
import styled from 'styled-components';

const PosterImage = ({
  posterPath,
  title,
}: {
  posterPath?: string;
  title: string;
}) => {
  return (
    <ImgBox>
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500/${posterPath}`}
          alt={title}
          width={360}
          height={560}
        />
      ) : (
        <NoneImg>IMAGE IS NONE</NoneImg>
      )}
    </ImgBox>
  );
};

export default PosterImage;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 360px;
  overflow: hidden;
  border-radius: 1.5rem;

  Img {
    width: 100%;
    border-radius: 1.5rem;
  }

  /* &:hover {
    Img {
      scale: 105%;
      transition: scale ease-in 150ms;
    }
  } */
`;

const NoneImg = styled.div`
  width: 360px;
  height: 560px;
  font-weight: 700;
  color: black;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
`;
