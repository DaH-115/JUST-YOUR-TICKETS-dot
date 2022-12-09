import Image from 'next/image';
import styled from 'styled-components';

const PosterImage = ({
  posterImage,
  posterPath,
  title,
}: {
  posterImage?: string;
  posterPath?: string;
  title: string;
}) => {
  return (
    <ImgBox>
      {!posterImage && !posterPath && <NoneImg>IMAGE IS NONE</NoneImg>}
      {posterImage ? (
        <Image src={posterImage} alt={title} width={360} height={560} />
      ) : (
        <Image
          src={`https://image.tmdb.org/t/p/w500/${posterPath}`}
          alt={title}
          width={360}
          height={560}
        />
      )}
    </ImgBox>
  );
};

export default PosterImage;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 1.5rem;

  Img {
    border-radius: 1.5rem;
  }
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
